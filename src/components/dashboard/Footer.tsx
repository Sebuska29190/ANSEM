export function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="mt-12 w-full border-t border-white/[0.06] bg-[#030305]/80 py-8 text-center">
      <p className="text-sm text-muted">
        © {currentYear} ANSEM.AI — Solana Token Terminal. Not financial advice.
      </p>
      <p className="mt-1 text-xs text-muted/60">
        Data powered by DexScreener · News powered by DeepSeek AI
      </p>
    </footer>
  );
}
