/**
 * news-store.ts
 * ----------------------------------------------------------------------
 * Single source of truth for AI news history.
 *
 *  Primary store : filesystem JSON at `${cwd}/data/news.json`
 *                  – works in `npm run dev` and on any long-lived Node host
 *  Mirror        : Netlify Blobs key `ai-news/history`
 *                  – used on Netlify deploys (filesystem is volatile there)
 *  Fallback      : in-memory cache (so serverless re-runs don't churn disk)
 *
 * Both writes go to fs first, then Blobs.
 * Reads prefer fs, hydrate from Blobs if fs is empty.
 *
 * IMPORTANT: this module is server-only. Never import it from a
 * "use client" component.
 */

import { promises as fs } from "node:fs";
import path from "node:path";
import type { AINewsItem } from "@/types";

const MAX_HISTORY = 50;
const FILE_NAME = "news.json";

type Shape = { items: AINewsItem[] };

interface BlobLike {
  get(key: string): Promise<string | ArrayBuffer | null>;
  setJSON(key: string, value: unknown): Promise<void>;
}

let memCache: Shape | null = null;

/**
 * Per-process write mutex. The /api/news endpoint and the scheduled
 * Netlify function can co-fire; without serialisation the second
 * writer would clobber the first one's item. This chains writes so
 * they happen one-at-a-time within a given Node process.
 *
 * Note: in serverless deployments each cold instance has its own
 * mutex (acceptable – instances are isolated from each other and
 * the Blobs mirror reconciles via eventual consistency).
 */
let writeLock: Promise<unknown> = Promise.resolve();
function withWriteLock<T>(fn: () => Promise<T>): Promise<T> {
  const run = writeLock.then(fn, fn);
  // Swallow errors on the lock chain itself so a single failure
  // doesn't poison all subsequent writes.
  writeLock = run.catch(() => undefined);
  return run;
}

function jsonPath(): string {
  return path.join(process.cwd(), "data", FILE_NAME);
}

function isValidItem(item: unknown): item is AINewsItem {
  if (!item || typeof item !== "object") return false;
  const o = item as Record<string, unknown>;
  return (
    typeof o.id === "string" &&
    typeof o.content === "string" &&
    typeof o.createdAt === "number" &&
    (o.sentiment === "bullish" ||
      o.sentiment === "bearish" ||
      o.sentiment === "neutral")
  );
}

async function readFs(): Promise<Shape | null> {
  try {
    const buf = await fs.readFile(jsonPath(), "utf8");
    const parsed = JSON.parse(buf) as Shape;
    if (parsed && Array.isArray(parsed.items)) {
      const safe = parsed.items.filter(isValidItem);
      return { items: safe };
    }
  } catch {
    /* ENOENT, EACCES, etc. — fall through */
  }
  return null;
}

async function writeFs(shape: Shape): Promise<void> {
  memCache = shape;
  try {
    const dir = path.dirname(jsonPath());
    await fs.mkdir(dir, { recursive: true });
    await fs.writeFile(jsonPath(), JSON.stringify(shape, null, 2), "utf8");
  } catch {
    /* keep going — in-memory cache still serves this process */
  }
}

async function readBlob(): Promise<Shape | null> {
  try {
    const mod = await import("@netlify/blobs");
    if (typeof mod.getStore !== "function") return null;
    const store = mod.getStore("ai-news") as unknown as BlobLike;
    const raw = await store.get("history");
    if (!raw) return null;
    const text =
      typeof raw === "string" ? raw : new TextDecoder().decode(raw);
    const parsed = JSON.parse(text) as Shape;
    if (parsed && Array.isArray(parsed.items)) {
      const safe = parsed.items.filter(isValidItem);
      return { items: safe };
    }
  } catch {
    /* not running on Netlify or blobs unavailable */
  }
  return null;
}

async function writeBlob(shape: Shape): Promise<void> {
  try {
    const mod = await import("@netlify/blobs");
    if (typeof mod.getStore !== "function") return;
    const store = mod.getStore("ai-news") as unknown as BlobLike;
    await store.setJSON("history", shape);
  } catch {
    /* noop */
  }
}

/** Returns the current history (newest first), filtering out anything invalid. */
export async function getNewsHistory(): Promise<AINewsItem[]> {
  const onDisk = await readFs();
  if (onDisk && onDisk.items.length > 0) return onDisk.items;

  const fromBlob = await readBlob();
  if (fromBlob && fromBlob.items.length > 0) {
    await writeFs(fromBlob);
    return fromBlob.items;
  }

  return (memCache?.items ?? []).filter(isValidItem);
}

/** Append one news item, dedupe by id, cap to MAX_HISTORY. Returns the new array. */
export async function addNewsItem(item: AINewsItem): Promise<AINewsItem[]> {
  if (!isValidItem(item)) {
    return getNewsHistory();
  }
  return withWriteLock(async () => {
    const current = await getNewsHistory();
    const dedup = current.filter((x) => x.id !== item.id);
    const next: AINewsItem[] = [item, ...dedup].slice(0, MAX_HISTORY);
    const shape: Shape = { items: next };
    await writeFs(shape);
    await writeBlob(shape);
    return next;
  });
}

/** Replace the entire history. Returns the new array. */
export async function setNewsHistory(items: AINewsItem[]): Promise<AINewsItem[]> {
  return withWriteLock(async () => {
    const safe = items.filter(isValidItem).slice(0, MAX_HISTORY);
    const shape: Shape = { items: safe };
    await writeFs(shape);
    await writeBlob(shape);
    return safe;
  });
}
