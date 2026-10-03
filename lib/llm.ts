import type { ChatMessage } from "./types";

/**
 * Tiny provider-agnostic LLM client (no SDKs, plain fetch). Picks Gemini or OpenAI from env.
 * Returns null when no key is set or the call fails, so routes can fall back to demo mode and the
 * on-stage demo never dies on venue Wi-Fi.
 */
type Args = { system: string; messages: ChatMessage[]; json?: boolean; temperature?: number; timeoutMs?: number };

const DEFAULT_TIMEOUT_MS = 15_000;

export function provider(): "gemini" | "openai" | null {
  if (process.env.GEMINI_API_KEY) return "gemini";
  if (process.env.OPENAI_API_KEY) return "openai";
  return null;
}

export async function complete(args: Args): Promise<string | null> {
  try {
    switch (provider()) {
      case "gemini":
        return await gemini(args);
      case "openai":
        return await openai(args);
      default:
        return null;
    }
  } catch (err) {
    console.error("[llm] falling back to demo mode:", err);
    return null;
  }
}

async function gemini({ system, messages, json, temperature = 0.6, timeoutMs = DEFAULT_TIMEOUT_MS }: Args) {
  const model = process.env.GEMINI_MODEL || "gemini-2.5-flash";
  const res = await fetch(`https://generativelanguage.googleapis.com/v1beta/models/${model}:generateContent`, {
    method: "POST",
    headers: { "Content-Type": "application/json", "x-goog-api-key": process.env.GEMINI_API_KEY! },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      systemInstruction: { parts: [{ text: system }] },
      contents: messages.map((m) => ({ role: m.role === "assistant" ? "model" : "user", parts: [{ text: m.content }] })),
      generationConfig: { temperature, ...(json ? { responseMimeType: "application/json" } : {}) },
      safetySettings: [
        // Victims need to describe abuse; let them. Our own guardrails handle crisis routing.
        { category: "HARM_CATEGORY_HARASSMENT", threshold: "BLOCK_ONLY_HIGH" },
        { category: "HARM_CATEGORY_SEXUALLY_EXPLICIT", threshold: "BLOCK_ONLY_HIGH" },
      ],
    }),
  });
  if (!res.ok) throw new Error(`Gemini ${res.status}: ${await res.text()}`);
  const data = await res.json();
  const text: string | undefined = data?.candidates?.[0]?.content?.parts?.map((p: { text?: string }) => p.text ?? "").join("");
  return text?.trim() || null;
}

async function openai({ system, messages, json, temperature = 0.6, timeoutMs = DEFAULT_TIMEOUT_MS }: Args) {
  const res = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: { "Content-Type": "application/json", Authorization: `Bearer ${process.env.OPENAI_API_KEY}` },
    signal: AbortSignal.timeout(timeoutMs),
    body: JSON.stringify({
      model: process.env.OPENAI_MODEL || "gpt-4o-mini",
      temperature,
      messages: [{ role: "system", content: system }, ...messages],
      ...(json ? { response_format: { type: "json_object" } } : {}),
    }),
  });
  if (!res.ok) throw new Error(`OpenAI ${res.status}: ${await res.text()}`);
  const data = await res.json();
  return (data?.choices?.[0]?.message?.content as string | undefined)?.trim() || null;
}

export function parseJson<T>(raw: string | null): T | null {
  if (!raw) return null;
  try {
    return JSON.parse(raw.replace(/^```(json)?\s*|\s*```$/g, "")) as T;
  } catch {
    return null;
  }
}
