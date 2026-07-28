/**
 * RugCheck API — public, no key required.
 * Returns risk score + risk factors for a Solana token.
 */

const BASE = "https://api.rugcheck.xyz/v1";

export interface RugCheckRisk {
  name: string;
  value: string;
  description: string;
  score: number;
  level: "good" | "warn" | "danger";
}

export interface RugCheckReport {
  score: number;
  scoreNormalised: number;
  risks: RugCheckRisk[];
  mintAuthority: string | null;
  freezeAuthority: string | null;
}

export async function fetchRiskReport(
  mint: string
): Promise<RugCheckReport | null> {
  try {
    const res = await fetch(`${BASE}/tokens/${mint}/report/summary`, {
      next: { revalidate: 3600 },
    });

    if (!res.ok) return null;

    const json = (await res.json()) as Record<string, unknown>;

    const risks: RugCheckRisk[] = Array.isArray(json.risks)
      ? (json.risks as Array<Record<string, unknown>>).map((r) => ({
          name: String(r.name ?? ""),
          value: String(r.value ?? ""),
          description: String(r.description ?? ""),
          score: Number(r.score ?? 0),
          level: (r.level as RugCheckRisk["level"]) ?? "warn",
        }))
      : [];

    return {
      score: Number(json.score ?? 0),
      scoreNormalised: Number(json.score_normalised ?? 0),
      risks,
      mintAuthority: (json.mintAuthority as string) ?? null,
      freezeAuthority: (json.freezeAuthority as string) ?? null,
    };
  } catch {
    return null;
  }
}
