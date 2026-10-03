import { redact } from "./redact";
import type { ChatMessage, Lang } from "./types";

const LANG_IDS: Lang[] = ["en", "zh", "ms", "ta"];

/** Validate + re-redact input on the server too: never trust the client to have stripped PII. */
export function sanitize(body: unknown): { messages: ChatMessage[]; lang: Lang } {
  const b = (body ?? {}) as { messages?: unknown; lang?: unknown };
  const lang = LANG_IDS.includes(b.lang as Lang) ? (b.lang as Lang) : "en";
  const raw = Array.isArray(b.messages) ? b.messages : [];
  const messages = raw
    .filter((m): m is ChatMessage => !!m && (m.role === "user" || m.role === "assistant") && typeof m.content === "string")
    .slice(-20)
    .map((m) => ({ role: m.role, content: redact(m.content.slice(0, 4000)).text }));
  return { messages, lang };
}
