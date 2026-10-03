import { NextResponse } from "next/server";
import { demoReply } from "@/lib/demo";
import { detectCategory, detectCrisis } from "@/lib/guardrails";
import { complete, provider } from "@/lib/llm";
import { chatSystemPrompt } from "@/lib/prompts";
import { sanitize } from "@/lib/server";

export async function POST(req: Request) {
  const { messages, lang } = sanitize(await req.json().catch(() => null));
  if (!messages.length) return NextResponse.json({ error: "No messages" }, { status: 400 });

  const userText = messages.filter((m) => m.role === "user").map((m) => m.content).join("\n");
  const latest = messages.filter((m) => m.role === "user").at(-1)?.content ?? "";
  const crisis = detectCrisis(latest);
  const category = detectCategory(userText);

  const live = await complete({ system: chatSystemPrompt(lang, category, crisis), messages });
  return NextResponse.json({
    reply: live ?? demoReply(messages, lang, crisis),
    mode: live ? "live" : "demo",
    provider: live ? provider() : null,
    crisis,
    category,
  });
}
