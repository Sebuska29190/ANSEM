import type { AINewsItem } from "../types";

const DEEPSEEK_API_URL = "https://api.deepseek.com/v1/chat/completions";
const MODEL = "deepseek-chat";

export interface GenerateNewsInput {
  priceUsd: number;
  priceChange24h: number | null;
  volume24h: number | null;
  liquidityUsd: number | null;
}

export async function generateAINews(
  data: GenerateNewsInput
): Promise<AINewsItem> {
  const apiKey = process.env.DEEPSEEK_API_KEY;
  if (!apiKey) {
    throw new Error("DEEPSEEK_API_KEY is not configured");
  }

  const prompt = buildPrompt(data);

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
            "You are a crypto market analyst specialized in Solana memecoins. Write concise, factual news in English. Return only a JSON object with keys: content (string, max 3 sentences), sentiment (string: bullish|bearish|neutral).",
        },
        { role: "user", content: prompt },
      ],
      response_format: { type: "json_object" },
      temperature: 0.7,
    }),
  });

  if (!res.ok) {
    throw new Error(`DeepSeek API error: ${res.status}`);
  }

  const json = (await res.json()) as {
    choices?: { message?: { content?: string } }[];
  };
  const content = json.choices?.[0]?.message?.content;
  if (!content) {
    throw new Error("DeepSeek response missing content");
  }

  const parsed = JSON.parse(content) as {
    content: string;
    sentiment: string;
  };

  return {
    id: `news-${Date.now()}`,
    content: parsed.content,
    sentiment: validateSentiment(parsed.sentiment),
    createdAt: Date.now(),
    sourceData: {
      priceUsd: data.priceUsd,
      priceChange24h: data.priceChange24h,
      volume24h: data.volume24h,
    },
  };
}

function buildPrompt(data: GenerateNewsInput): string {
  return `
Token: ANSEM (Solana)
Price: $${data.priceUsd}
24h change: ${data.priceChange24h ?? "N/A"}%
24h volume: $${data.volume24h ?? "N/A"}
Liquidity: $${data.liquidityUsd ?? "N/A"}

Write a short English news update (max 3 sentences) summarizing the current situation of the ANSEM token.
`.trim();
}

function validateSentiment(
  value: string
): "bullish" | "bearish" | "neutral" {
  if (value === "bullish" || value === "bearish") return value;
  return "neutral";
}
