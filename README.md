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
- **Netlify** — hosting, functions, and scheduled jobs

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

This project is optimized for **Netlify**.

1. Push to GitHub.
2. Import the repository in Netlify.
3. Set the environment variables in Netlify Site settings.
4. Deploy.

### Scheduled Functions

Netlify Scheduled Functions are defined in:

- `netlify/functions/generate-news.ts` — runs every 30 minutes and stores the latest AI news in Netlify Blobs.

### AI News Persistence

Generated news are stored in Netlify Blobs. The `/api/news` endpoint reads the latest item from blob storage and falls back to on-demand generation if nothing has been cached yet.

### Local Development with Netlify Functions

To test scheduled functions or Netlify Blobs locally, use the Netlify CLI:

```bash
npm install -g netlify-cli
netlify link
netlify dev
```

Without `netlify dev`, Netlify Blobs may not be available locally.

## Project Structure

```
netlify/
  functions/        # Netlify Functions (scheduled jobs)
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
