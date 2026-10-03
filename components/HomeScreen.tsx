"use client";

import { useState } from "react";
import { LANGS, T } from "@/lib/i18n";
import type { Lang } from "@/lib/types";
import { ShieldIcon } from "./Shell";

const MOOD_EMOJI = ["😰", "😨", "😔", "😠", "😶"];

type Props = {
  lang: Lang;
  setLang: (l: Lang) => void;
  mood: number | null;
  setMood: (m: number) => void;
  onStart: (text: string) => void;
};

export function HomeScreen({ lang, setLang, mood, setMood, onStart }: Props) {
  const t = T[lang];
  const [draft, setDraft] = useState("");

  return (
    <div className="space-y-6 px-4 py-6">
      <section className="rise rounded-3xl bg-white p-5 shadow-sm">
        <div className="flex items-center gap-3">
          <ShieldIcon size={44} />
          <h1 className="text-2xl font-semibold">{t.safeHere}</h1>
        </div>
        <p className="mt-3 text-sm leading-relaxed text-muted">🔒 {t.nothingStored}</p>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted">{t.chooseLang}</h2>
        <div className="grid grid-cols-4 gap-2">
          {LANGS.map((l) => (
            <button
              key={l.id}
              onClick={() => setLang(l.id)}
              aria-pressed={lang === l.id}
              className={`rounded-2xl border px-2 py-3 text-sm font-semibold transition ${
                lang === l.id ? "border-sage-500 bg-sage-100 text-sage-700" : "border-sage-100 bg-white hover:bg-sage-50"
              }`}
            >
              {l.label}
            </button>
          ))}
        </div>
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted">{t.howFeeling}</h2>
        <div className="grid grid-cols-5 gap-2">
          {t.moods.map((m, i) => (
            <button
              key={i}
              onClick={() => setMood(i)}
              aria-pressed={mood === i}
              className={`flex flex-col items-center gap-1 rounded-2xl border py-2 text-[11px] transition ${
                mood === i ? "border-lav-500 bg-lav-100 text-lav-600" : "border-sage-100 bg-white hover:bg-lav-50"
              }`}
            >
              <span className="text-2xl" aria-hidden>
                {MOOD_EMOJI[i]}
              </span>
              {m}
            </button>
          ))}
        </div>
        {mood !== null && (
          <p className="rise mt-3 rounded-2xl bg-lav-50 p-3 text-sm text-lav-600">
            {groundingLine(lang)}
          </p>
        )}
      </section>

      <section>
        <h2 className="mb-2 text-sm font-semibold text-muted">{t.whatHappened}</h2>
        <div className="space-y-2">
          {t.quickStarts.map((q) => (
            <button
              key={q.label}
              onClick={() => onStart(q.text)}
              className="w-full rounded-2xl border border-sage-100 bg-white px-4 py-3 text-left text-sm hover:border-sage-200 hover:bg-sage-50"
            >
              {q.label} →
            </button>
          ))}
        </div>
        <form
          className="mt-3 flex gap-2"
          onSubmit={(e) => {
            e.preventDefault();
            if (draft.trim()) onStart(draft.trim());
          }}
        >
          <input
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            placeholder={t.orType}
            className="min-w-0 flex-1 rounded-2xl border border-sage-200 bg-white px-4 py-3 text-sm outline-none focus:border-sage-500"
          />
          <button className="rounded-2xl bg-sage-600 px-4 text-sm font-semibold text-white disabled:opacity-40" disabled={!draft.trim()}>
            {t.send}
          </button>
        </form>
      </section>
    </div>
  );
}

/** A 10-second box-breathing cue shown after a mood is picked: grounding before problem-solving. */
function groundingLine(lang: Lang) {
  return {
    en: "That's a normal reaction to something unfair. Breathe in for 4… hold for 4… out for 4. We'll go one step at a time.",
    zh: "面对不公平的事，有这种感觉很正常。吸气4秒……停4秒……呼气4秒。我们一步一步来。",
    ms: "Itu reaksi biasa terhadap sesuatu yang tidak adil. Tarik nafas 4 saat… tahan 4… hembus 4. Kita buat satu langkah demi satu.",
    ta: "அநியாயமான ஒன்றுக்கு இது இயல்பான உணர்வு. 4 வரை மூச்சை இழுங்கள்… 4 வரை நிறுத்துங்கள்… 4 வரை விடுங்கள். ஒவ்வொரு அடியாகப் போவோம்.",
  }[lang];
}
