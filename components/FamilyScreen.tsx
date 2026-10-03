"use client";

import { useEffect, useState } from "react";
import { LANGS, T } from "@/lib/i18n";
import type { Audience, FamilyBrief, Lang } from "@/lib/types";
import { Spinner } from "./Shell";

type Props = {
  lang: Lang;
  hasChat: boolean;
  audience: Audience;
  setAudience: (a: Audience) => void;
  briefLang: Lang;
  setBriefLang: (l: Lang) => void;
  brief: FamilyBrief | null;
  loading: boolean;
  onGenerate: () => void;
};

const AUDIENCE_ICON: Record<Audience, string> = { mum: "👩", dad: "👨", grandparent: "👵", teacher: "🧑‍🏫" };

export function FamilyScreen(p: Props) {
  const t = T[p.lang];
  return (
    <div className="space-y-5 px-4 py-6">
      <section>
        <h1 className="text-xl font-semibold">{t.family.title}</h1>
        <p className="mt-2 text-sm leading-relaxed text-muted">{t.family.intro}</p>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted">{t.family.who}</h2>
        <div className="grid grid-cols-2 gap-2">
          {(Object.keys(t.family.audiences) as Audience[]).map((a) => (
            <button
              key={a}
              onClick={() => p.setAudience(a)}
              aria-pressed={p.audience === a}
              className={`rounded-2xl border px-3 py-3 text-left text-sm font-medium ${
                p.audience === a ? "border-lav-500 bg-lav-100 text-lav-600" : "border-sage-100 bg-white hover:bg-lav-50"
              }`}
            >
              <span className="mr-1.5" aria-hidden>
                {AUDIENCE_ICON[a]}
              </span>
              {t.family.audiences[a]}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted">{t.family.theirLang}</h2>
        <div className="grid grid-cols-4 gap-2">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => p.setBriefLang(l.id)}
              aria-pressed={p.briefLang === l.id}
              className={`rounded-2xl border py-2.5 text-sm font-semibold ${
                p.briefLang === l.id ? "border-lav-500 bg-lav-100 text-lav-600" : "border-sage-100 bg-white hover:bg-lav-50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      {p.hasChat ? (
        <button
          onClick={p.onGenerate}
          disabled={p.loading}
          className="w-full rounded-2xl bg-lav-600 py-3.5 text-sm font-semibold text-white hover:bg-lav-500 disabled:opacity-60"
        >
          {p.loading ? <Spinner label={t.thinking} /> : `✨ ${t.family.generate}`}
        </button>
      ) : (
        <p className="rounded-2xl bg-white p-4 text-sm text-muted">{t.family.needChat}</p>
      )}

      {p.brief && !p.loading && (
        <BriefCard brief={p.brief} lang={p.briefLang} who={T[p.briefLang].family.audiences[p.audience]} />
      )}
    </div>
  );
}

function BriefCard({ brief, lang, who }: { brief: FamilyBrief; lang: Lang; who: string }) {
  const c = T[lang].card;
  const [speaking, setSpeaking] = useState(false);
  const [copied, setCopied] = useState(false);
  const [noVoice, setNoVoice] = useState(false);

  const plain = [
    c.heading(who),
    `${c.fromChild}: "${brief.openingLine}"`,
    `${c.whatHappened}: ${brief.whatHappened}`,
    `${c.notTheirFault}: ${brief.notTheirFault}`,
    `${c.doNow}:\n${brief.doNow.map((d) => `• ${d}`).join("\n")}`,
    `${c.avoid}:\n${brief.avoid.map((d) => `• ${d}`).join("\n")}`,
  ].join("\n\n");

  useEffect(() => () => window.speechSynthesis?.cancel(), []);

  function speak() {
    const synth = window.speechSynthesis;
    if (!synth) return setNoVoice(true);
    if (speaking) {
      synth.cancel();
      return setSpeaking(false);
    }
    const code = LANGS.find((l) => l.id === lang)!.speech;
    const prefix = code.slice(0, 2);
    const voice = synth.getVoices().find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(prefix));
    if (!voice && lang !== "en") return setNoVoice(true);
    const u = new SpeechSynthesisUtterance(plain.replace(/•/g, ""));
    u.lang = code;
    if (voice) u.voice = voice;
    u.rate = 0.9; // slower for elderly listeners
    u.onend = () => setSpeaking(false);
    synth.cancel();
    synth.speak(u);
    setSpeaking(true);
  }

  async function copy() {
    await navigator.clipboard.writeText(plain);
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <article lang={lang} className="rise print-area overflow-hidden rounded-3xl bg-white shadow-sm">
      <div className="bg-gradient-to-r from-lav-100 to-sage-100 px-5 py-4">
        <h3 className="text-lg font-semibold">💌 {c.heading(who)}</h3>
      </div>
      <div className="space-y-4 p-5 text-[15px] leading-relaxed">
        <blockquote className="rounded-2xl bg-lav-50 p-4 italic text-lav-600">
          <div className="mb-1 text-xs font-semibold not-italic uppercase tracking-wide">{c.fromChild}</div>
          “{brief.openingLine}”
        </blockquote>
        <Section title={c.whatHappened}>{brief.whatHappened}</Section>
        <Section title={c.notTheirFault}>{brief.notTheirFault}</Section>
        <Section title={c.doNow}>
          <ul className="space-y-1.5">
            {brief.doNow.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-sage-600">✓</span>
                {d}
              </li>
            ))}
          </ul>
        </Section>
        <Section title={c.avoid}>
          <ul className="space-y-1.5">
            {brief.avoid.map((d) => (
              <li key={d} className="flex gap-2">
                <span className="text-rose-ink">✕</span>
                {d}
              </li>
            ))}
          </ul>
        </Section>
      </div>
      <div className="no-print grid grid-cols-2 gap-2 border-t border-sage-100 p-4">
        <button onClick={speak} className="rounded-2xl bg-sage-600 py-3 text-sm font-semibold text-white">
          {speaking ? `⏹ ${c.stop}` : `🔊 ${c.readAloud}`}
        </button>
        <button onClick={copy} className="rounded-2xl border border-sage-200 py-3 text-sm font-semibold text-sage-700">
          {copied ? `✓ ${c.copied}` : `📋 ${c.copy}`}
        </button>
        {noVoice && <p className="col-span-2 text-center text-xs text-muted">{c.noVoice}</p>}
      </div>
    </article>
  );
}

function Section({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <section>
      <h4 className="mb-1 text-xs font-semibold uppercase tracking-wide text-muted">{title}</h4>
      <div>{children}</div>
    </section>
  );
}
