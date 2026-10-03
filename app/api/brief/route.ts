import { NextResponse } from "next/server";
import { demoBrief } from "@/lib/demo";
import { complete, parseJson } from "@/lib/llm";
import { briefSystemPrompt } from "@/lib/prompts";
import { sanitize } from "@/lib/server";
import type { Audience, FamilyBrief } from "@/lib/types";

const AUDIENCES: Audience[] = ["mum", "dad", "grandparent", "teacher"];

export async function POST(req: Request) {
  const body = await req.json().catch(() => null);
  const { messages, lang } = sanitize(body);
  const audience: Audience = AUDIENCES.includes(body?.audience) ? body.audience : "mum";
  if (!messages.some((m) => m.role === "user")) return NextResponse.json({ error: "No conversation yet" }, { status: 400 });

  const transcript = messages.map((m) => `${m.role === "user" ? "YOUTH" : "MINDSHIELD"}: ${m.content}`).join("\n");
  const raw = await complete({
    system: briefSystemPrompt(lang, audience),
    messages: [{ role: "user", content: transcript }],
    json: true,
    temperature: 0.4,
  });
  const brief = parseJson<FamilyBrief>(raw);
  const valid = brief && brief.whatHappened && Array.isArray(brief.doNow) && Array.isArray(brief.avoid);
  return NextResponse.json({ brief: valid ? brief : demoBrief(messages, lang), mode: valid ? "live" : "demo" });
}
