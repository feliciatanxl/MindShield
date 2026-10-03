import { NextResponse } from "next/server";
import { demoIncident } from "@/lib/demo";
import { complete, parseJson } from "@/lib/llm";
import { INCIDENT_SYSTEM_PROMPT } from "@/lib/prompts";
import { sanitize } from "@/lib/server";
import type { Category, Incident } from "@/lib/types";

const CATS: Category[] = ["intimate", "doxxing", "scam", "harassment", "general"];

export async function POST(req: Request) {
  const { messages } = sanitize(await req.json().catch(() => null));
  if (!messages.some((m) => m.role === "user")) return NextResponse.json({ error: "No conversation yet" }, { status: 400 });

  const transcript = messages.map((m) => `${m.role === "user" ? "YOUTH" : "MINDSHIELD"}: ${m.content}`).join("\n");
  const raw = await complete({
    system: INCIDENT_SYSTEM_PROMPT,
    messages: [{ role: "user", content: transcript }],
    json: true,
    temperature: 0.1,
  });
  const parsed = parseJson<Incident>(raw);
  const valid = parsed && CATS.includes(parsed.category) && typeof parsed.summary === "string";
  const incident: Incident = valid
    ? { ...parsed, handles: Array.isArray(parsed.handles) ? parsed.handles : [] }
    : demoIncident(messages);
  return NextResponse.json({ incident, mode: valid ? "live" : "demo" });
}
