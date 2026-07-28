"use client";

import { ShieldCheck, ShieldAlert, ExternalLink } from "lucide-react";
import { useSecurity } from "@/hooks/useSecurity";
import { ANSEM_ADDRESS } from "@/lib/constants";
import { Panel } from "@/components/ui/Panel";

/**
 * Security — RugCheck risk audit. Real score + checklist.
 * Builds trust by showing actual on-chain risk factors.
 */

function scoreColor(score: number) {
  if (score <= 1) return "text-up";
  if (score <= 2) return "text-gold";
  return "text-down";
}

function scoreLabel(score: number) {
  if (score <= 1) return "Good";
  if (score <= 2) return "Caution";
  return "Risky";
}

export function Security() {
  const { data, isLoading } = useSecurity();
  const report = data?.data;

  const checks = report
    ? [
        {
          label: "Mint Authority",
          ok: !report.mintAuthority,
          detail: report.mintAuthority ? "Enabled — supply can be inflated" : "Revoked — supply is fixed",
        },
        {
          label: "Freeze Authority",
          ok: !report.freezeAuthority,
          detail: report.freezeAuthority ? "Enabled — wallets can be frozen" : "Revoked — no freezing",
        },
      ]
    : [];

  return (
    <Panel>
      <div className="flex items-center justify-between border-b border-line px-5 py-3">
        <span className="flex items-center gap-2 text-xs font-bold uppercase tracking-[0.2em] text-dim">
          <ShieldCheck className="h-3.5 w-3.5 text-up" />
          Security Audit
        </span>
        <a
          href={`https://rugcheck.xyz/tokens/${ANSEM_ADDRESS}`}
          target="_blank"
          rel="noopener noreferrer"
          className="inline-flex items-center gap-1 text-[10px] font-bold uppercase tracking-[0.15em] text-info transition-colors hover:text-text"
        >
          Full report <ExternalLink className="h-3 w-3" />
        </a>
      </div>

      <div className="grid grid-cols-1 gap-6 p-5 md:grid-cols-3">
        {/* Score gauge */}
        <div className="flex flex-col items-center justify-center">
          {isLoading ? (
            <div className="h-20 w-20 animate-pulse rounded-full bg-raised" />
          ) : report ? (
            <>
              <div className="flex h-24 w-24 items-center justify-center rounded-full border-2 border-line">
                <span className={`font-display text-3xl font-black ${scoreColor(report.scoreNormalised || report.score)}`}>
                  {report.scoreNormalised || report.score}
                </span>
              </div>
              <span className={`mt-2 text-xs font-bold uppercase tracking-[0.15em] ${scoreColor(report.scoreNormalised || report.score)}`}>
                {scoreLabel(report.scoreNormalised || report.score)}
              </span>
              <span className="mt-0.5 text-[10px] text-dim">RugCheck score</span>
            </>
          ) : (
            <span className="text-sm text-dim">Report unavailable</span>
          )}
        </div>

        {/* Checklist */}
        <div className="space-y-3 md:col-span-2">
          {isLoading ? (
            [...Array(3)].map((_, i) => (
              <div key={i} className="h-10 animate-pulse rounded-[2px] bg-raised" />
            ))
          ) : report ? (
            <>
              {checks.map((c) => (
                <div
                  key={c.label}
                  className="flex items-center gap-3 rounded-[2px] border border-line bg-raised/40 px-4 py-2.5"
                >
                  {c.ok ? (
                    <ShieldCheck className="h-4 w-4 shrink-0 text-up" />
                  ) : (
                    <ShieldAlert className="h-4 w-4 shrink-0 text-down" />
                  )}
                  <div className="min-w-0">
                    <p className="text-xs font-bold text-text">{c.label}</p>
                    <p className="text-[11px] text-dim">{c.detail}</p>
                  </div>
                  <span
                    className={`ml-auto shrink-0 rounded-[2px] px-2 py-0.5 text-[10px] font-bold uppercase tracking-[0.15em] ${
                      c.ok ? "bg-up/10 text-up" : "bg-down/10 text-down"
                    }`}
                  >
                    {c.ok ? "Pass" : "Warn"}
                  </span>
                </div>
              ))}
              {report.risks.length > 0 && (
                <div className="rounded-[2px] border border-line bg-raised/40 px-4 py-2.5">
                  <p className="text-xs font-bold text-text">
                    Flagged risks ({report.risks.length})
                  </p>
                  <ul className="mt-1 space-y-0.5">
                    {report.risks.slice(0, 4).map((r) => (
                      <li key={r.name} className="text-[11px] text-dim">
                        · {r.description || r.name}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
            </>
          ) : (
            <p className="text-sm text-dim">
              Security report could not be loaded. Check RugCheck directly.
            </p>
          )}
        </div>
      </div>

      <div className="border-t border-line px-5 py-2 text-[10px] text-dim">
        Automated audit via RugCheck. Always do your own research.
      </div>
    </Panel>
  );
}
