"use client";

import { useEffect, useState } from "react";
import { ActionScreen } from "@/components/ActionScreen";
import { FamilyScreen } from "@/components/FamilyScreen";
import { HomeScreen } from "@/components/HomeScreen";
import { BottomNav, CrisisBanner, Header, HotlineSheet, type Tab } from "@/components/Shell";
import { TalkScreen } from "@/components/TalkScreen";
import { detectCategory, detectCrisis } from "@/lib/guardrails";
import { T } from "@/lib/i18n";
import { redact } from "@/lib/redact";
import type { AiMode, Audience, ChatMessage, FamilyBrief, Incident, Lang } from "@/lib/types";

/**
 * Everything lives in React state only: no localStorage, no cookies, no server DB.
 * Closing the tab (or Quick Exit) erases the whole session.
 */
export default function MindShield() {
  const [tab, setTab] = useState<Tab>("home");
  const [lang, setLang] = useState<Lang>("en");
  const [mood, setMood] = useState<number | null>(null);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [chatLoading, setChatLoading] = useState(false);
  const [redacted, setRedacted] = useState(0);
  const [mode, setMode] = useState<AiMode | null>(null);
  const [crisis, setCrisis] = useState(false);
  const [showHotlines, setShowHotlines] = useState(false);

  const [audience, setAudience] = useState<Audience>("mum");
  const [briefLang, setBriefLang] = useState<Lang>("zh");
  const [brief, setBrief] = useState<FamilyBrief | null>(null);
  const [briefLoading, setBriefLoading] = useState(false);

  const [checked, setChecked] = useState<boolean[]>(() => Array(5).fill(false));
  const [incident, setIncident] = useState<Incident | null>(null);
  const [incidentLoading, setIncidentLoading] = useState(false);

  useEffect(() => {
    document.documentElement.lang = { en: "en", zh: "zh-Hans", ms: "ms", ta: "ta" }[lang];
  }, [lang]);

  const hasChat = messages.some((m) => m.role === "user");
  const userText = messages.filter((m) => m.role === "user").map((m) => m.content).join(" ");

  async function send(raw: string) {
    // Guardrail 1: crisis check runs locally, BEFORE any network call, so help shows instantly.
    if (detectCrisis(raw)) setCrisis(true);
    // Guardrail 2: personal identifiers are stripped on-device.
    const { text, count } = redact(raw);
    const next: ChatMessage[] = [...messages, { role: "user", content: text }];
    setMessages(next);
    setRedacted(count);
    setTab("talk");
    setChatLoading(true);
    setBrief(null);
    setIncident(null);
    try {
      const res = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: next, lang }),
      });
      const data = await res.json();
      if (data.crisis) setCrisis(true);
      setMode(data.mode);
      setMessages([...next, { role: "assistant", content: data.reply }]);
    } catch {
      setMessages([...next, { role: "assistant", content: offlineLine(lang) }]);
      setShowHotlines(true);
    } finally {
      setChatLoading(false);
    }
  }

  async function generateBrief() {
    setBriefLoading(true);
    try {
      const res = await fetch("/api/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages, lang: briefLang, audience }),
      });
      setBrief((await res.json()).brief ?? null);
    } finally {
      setBriefLoading(false);
    }
  }

  async function buildIncident() {
    setIncidentLoading(true);
    try {
      const res = await fetch("/api/incident", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages }),
      });
      setIncident((await res.json()).incident ?? null);
    } finally {
      setIncidentLoading(false);
    }
  }

  function quickExit() {
    setMessages([]);
    setBrief(null);
    setIncident(null);
    window.speechSynthesis?.cancel();
    // replace() so the Back button can't return here.
    window.location.replace("https://www.google.com/search?q=weather+singapore");
  }

  return (
    <div className="mx-auto flex min-h-dvh max-w-md flex-col bg-sage-50/60 shadow-xl shadow-sage-200/40 sm:border-x sm:border-sage-100">
      <Header lang={lang} onExit={quickExit} onHelp={() => setShowHotlines(true)} />
      {crisis && <CrisisBanner lang={lang} onMore={() => setShowHotlines(true)} />}

      <main className="flex-1">
        {tab === "home" && <HomeScreen lang={lang} setLang={setLang} mood={mood} setMood={setMood} onStart={send} />}
        {tab === "talk" && (
          <TalkScreen
            lang={lang}
            messages={messages}
            loading={chatLoading}
            redacted={redacted}
            mode={mode}
            onSend={send}
            goFamily={() => setTab("family")}
            goAction={() => setTab("action")}
          />
        )}
        {tab === "family" && (
          <FamilyScreen
            lang={lang}
            hasChat={hasChat}
            audience={audience}
            setAudience={(a) => (setAudience(a), setBrief(null))}
            briefLang={briefLang}
            setBriefLang={(l) => (setBriefLang(l), setBrief(null))}
            brief={brief}
            loading={briefLoading}
            onGenerate={generateBrief}
          />
        )}
        {tab === "action" && (
          <ActionScreen
            lang={lang}
            hasChat={hasChat}
            checked={checked}
            toggle={(i) => setChecked((c) => c.map((v, j) => (j === i ? !v : v)))}
            incident={incident}
            setIncident={setIncident}
            loading={incidentLoading}
            onBuild={buildIncident}
            fallbackCategory={detectCategory(userText)}
          />
        )}
      </main>

      <BottomNav lang={lang} tab={tab} setTab={setTab} />
      {showHotlines && <HotlineSheet lang={lang} onClose={() => setShowHotlines(false)} />}
    </div>
  );
}

function offlineLine(lang: Lang) {
  return `${T[lang].crisisBody} SOS 1767 · WhatsApp 9151 1767 · Mindline 1771`;
}
