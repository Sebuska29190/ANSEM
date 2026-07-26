# ANSEM.AI — Solana Token Terminal

Live dashboard for the **ANSEM** token on Solana: real-time price, market stats, charts, liquidity pools, and AI-generated news.

## Tech Stack

- **Next.js 14** (App Router)
- **TypeScript**
- **Tailwind CSS**
- **shadcn/ui-style components**
- **Framer Motion**
- **Lightweight Charts**
- **TanStack Query**
- **DeepSeek API** for AI news

## Data Sources

- **DexScreener** — price, market cap, liquidity, volume, pairs (free, no key)
- **DeepSeek** — AI news generation (`deepseek-chat` model)

## Getting Started

1. Copy `.env.example` to `.env.local` and fill in your keys:

```bash
cp .env.example .env.local
```

2. Install dependencies:

```bash
npm install
```

3. Run the development server:

```bash
npm run dev
```

4. Open [http://localhost:3000](http://localhost:3000).

## Environment Variables

| Variable | Description |
|----------|-------------|
| `DEEPSEEK_API_KEY` | DeepSeek API key (server-side only) |
| `NEXT_PUBLIC_ANSEM_ADDRESS` | Solana mint address for ANSEM |
| `NEXT_PUBLIC_SITE_URL` | Public site URL for metadata |

## Deployment

This project is optimized for **Vercel**.

1. Push to GitHub.
2. Import the repository in Vercel.
3. Set the environment variables.
4. Deploy.

Cron jobs are defined in `vercel.json`:

- `/api/cron/generate-news` — every 30 minutes

## Note on AI News

The current MVP generates AI news on each request to `/api/news`. For production, it is recommended to add a persistence layer (e.g., Vercel KV or Upstash Redis) so the cron job can store news and the frontend can read cached items without calling DeepSeek on every page load.

## Project Structure

```
src/
  app/              # Next.js App Router routes and API
  components/       # UI and dashboard components
  hooks/            # TanStack Query hooks
  lib/              # Utilities, constants, chart data
  services/         # API integrations (DexScreener, DeepSeek)
  types/            # TypeScript types
```

## License

MIT
