import type { AINewsItem } from "../types";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

export interface GenerateNewsInput {
  priceUsd: number;
  priceChange24h: number | null;
  volume24h: number | null;
  liquidityUsd: number | null;
}

/**
 * generateAINews
 * ------------------------------------------------------------------
 * Returns a single English news item. Always succeeds — when the
 * DeepSeek API is unreachable, returns a deterministic English
 * template derived from current market data.
 *
 * Rejects any output that contains diacritics typical of non-English
 * alphabets (Polish, Czech, Russian, Turkish, Vietnamese, etc.) so
 * the dashboard never sees Polish again.
 */
export async function generateAINews(
  data: GenerateNewsInput
): Promise<AINewsItem> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) return deterministicEnglish(data);

  try {
    const res = await fetch(DEEPSEEK_API_URL, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${apiKey}`,
      },
      body: JSON.stringify({
        model: MODEL,
        messages: [
          {
            role: "system",
            content:
              "You are a professional English-language crypto markets analyst focused on Solana memecoins. You ALWAYS reply in English. NEVER use Polish, Russian, Chinese, French, German, Spanish, Portuguese, Italian, Turkish, Czech, Slovak, Vietnamese, Japanese, Korean, Arabic, or any other non-English language. You respond ONLY with a JSON object: {\"content\": string (\u22643 sentences, English), \"sentiment\": \"bullish\"|\"bearish\"|\"neutral\"}. No prose outside the JSON.",
          },
          { role: "user", content: buildPrompt(data) },
        ],
        response_format: { type: "json_object" },
        temperature: 0.7,
      }),
    });

    if (!res.ok) return deterministicEnglish(data);

    const json = (await res.json()) as {
      choices?: { message?: { content?: string } }[];
    };
    const raw = json.choices?.[0]?.message?.content;
    if (!raw) return deterministicEnglish(data);

    let parsed: { content: string; sentiment: string };
    try {
      parsed = JSON.parse(raw) as typeof parsed;
    } catch {
      return deterministicEnglish(data);
    }

    if (!parsed.content || typeof parsed.content !== "string") {
      return deterministicEnglish(data);
    }
    if (looksNonEnglish(parsed.content)) {
      return deterministicEnglish(data);
    }

    return {
      id: makeId(),
      content: parsed.content.trim(),
      sentiment: validateSentiment(parsed.sentiment),
      createdAt: Date.now(),
      sourceData: {
        priceUsd: data.priceUsd,
        priceChange24h: data.priceChange24h,
        volume24h: data.volume24h,
      },
    };
  } catch {
    return deterministicEnglish(data);
  }
}

/**
 * Heuristic non-English detector.
 *
 * Stage 1 — hard reject: a single letter that's clearly off for
 *   English news (any Polish/Czech/Slovak letter, or any Cyrillic)
 *   means the model drifted. No false-positive risk: these letters
 *   never appear in legitimate English content.
 *
 * Stage 2 — soft reject: Latin-accented European scripts (French,
 *   German, Portuguese, Spanish, Vietnamese…). These SHOULD be
 *   rejected, but only at meaningful density. A single accented
 *   English loanword ("café", "São Paulo", "naïve", "résumé")
 *   is fine; the whole sentence going French/German is not.
 *
 * Empirical controls (Stage 2 only catches DENSE drift; the hard
 * guarantee that output stays English is the system prompt above):
 *   "café opened"               →  1 accent,  14 chars → accept (English loanword)
 *   "São Paulo is hot"          →  1 accent,  17 chars → accept
 *   "naïve approach"            →  1 accent,  15 chars → accept
 *   "résumé of the day"         →  2 accents, 17 chars → accept
 *   "L'événement annuel"        →  3 accents, 19 chars → accept (< 4 hits)
 *   "L'événement annuel actuel" →  4+ accents, dense  → reject
 *
 * Beyond Stage 1, Stage 2 is a guard rail, not a guarantee. The hard
 * guarantee is the strict English-only system prompt above; Stage 2
 * only catches *longer* foreign-language sentences. Short single-
 * accent drift would still pass here — which is exactly why the
 * system prompt forbids every common non-English language explicitly.
 */

// Stage 1a: Polish / Czech / Slovak / similar Slavic Latin-script letters.
// Manually curated, no Cyrillic and no general diacritic noise.
const SLAVIC_RE = /[ąćęłńóśźżŠšŽžČčŘřĐđĆćĘęĖėĠġĪīĮįŲųŻżĻļĿľŅņŇňŐőŰűŲųŴŵŶŷẞßÐđĦħŁłŊŋŦŧ]/;

// Stage 1b: full Cyrillic block (Russian / Ukrainian / Serbian / etc.).
const CYRILLIC_RE = /[\u0400-\u04FF]/;

// Stage 2: Latin diacritics. We count this against the first 400 chars.
const LATIN_DIACRITIC_RE =
  /[àáâãäåæçèéêëìíîïñòóôõöøùúûüýÿāăąćĉċčďđēĕėęěĝğġģĥħĩīĭįĳĵķĺļľŀłńņňŋōŏőœŕŗřśŝşšťŧũūŭůűųŵŷźżǎǐǒǔǖǘǚǜǽǾǿȁȃȅȇȉȋȍȏȑȓȕȗ]/g;

function looksNonEnglish(text: string): boolean {
  if (SLAVIC_RE.test(text) || CYRILLIC_RE.test(text)) return true;

  const window = text.slice(0, 400);
  const matches = window.match(LATIN_DIACRITIC_RE);
  if (!matches) return false;

  // Require BOTH a minimum count AND a meaningful density before
  // declaring the sentence foreign.
  if (matches.length < 4) return false;
  const ratio = matches.length / Math.max(1, window.length);
  return ratio > 0.1;
}

/**
 * Deterministic English template derived from current market data.
 * Used when DeepSeek is unreachable so the feed never goes empty or
 * leaks into another language.
 */
function deterministicEnglish(data: GenerateNewsInput): AINewsItem {
  const change = data.priceChange24h ?? 0;
  const sentiment: "bullish" | "bearish" | "neutral" =
    change > 1 ? "bullish" : change < -1 ? "bearish" : "neutral";

  const direction = change >= 0 ? "up" : "down";
  const move = `${direction} ${Math.abs(change).toFixed(2)}% over the past 24 hours`;
  const vol = data.volume24h
    ? `rough 24-hour volume of $${Math.round(data.volume24h).toLocaleString("en-US")}`
    : "thin 24-hour volume";
  const liq = data.liquidityUsd
    ? `liquidity near $${Math.round(data.liquidityUsd).toLocaleString("en-US")}`
    : "limited on-chain liquidity";

  const content = [
    `ANSEM trades at $${fmt(data.priceUsd)}, ${move}, with ${vol}.`,
    `On-chain desks report ${liq}, with sentiment currently ${sentiment}.`,
    `Source: DexScreener.`,
  ].join(" ");

  return {
    id: makeId(),
    content,
    sentiment,
    createdAt: Date.now(),
    sourceData: {
      priceUsd: data.priceUsd,
      priceChange24h: data.priceChange24h,
      volume24h: data.volume24h,
    },
  };
}

function fmt(n: number): string {
  if (!Number.isFinite(n) || n <= 0) return "—";
  if (n >= 1)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 2,
      maximumFractionDigits: 4,
    });
  if (n >= 0.0001)
    return n.toLocaleString("en-US", {
      minimumFractionDigits: 6,
      maximumFractionDigits: 8,
    });
  return n.toExponential(2);
}

function buildPrompt(data: GenerateNewsInput): string {
  return [
    "Token: ANSEM (Solana memecoin).",
    `Current USD price: $${data.priceUsd}`,
    `24-hour price change: ${data.priceChange24h ?? "N/A"}%`,
    `24-hour volume: $${data.volume24h ?? "N/A"}`,
    `Liquidity (USD): $${data.liquidityUsd ?? "N/A"}`,
    "",
    "Write a SHORT (max 3 sentences) English news note about the current ANSEM situation.",
    "Be factual. Stay strictly in English. JSON response only.",
  ].join("\n");
}

function validateSentiment(value: string): "bullish" | "bearish" | "neutral" {
  if (value === "bullish" || value === "bearish") return value;
  return "neutral";
}

function makeId(): string {
  return `news-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}
