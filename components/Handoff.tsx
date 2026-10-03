"use client";

import { useEffect, useState } from "react";
import { T } from "@/lib/i18n";
import { useSpeech } from "@/lib/speech";
import type { Audience, FamilyBrief, Lang } from "@/lib/types";
import { ShieldIcon } from "./Shell";

type Props = {
  brief: FamilyBrief;
  /** Caregiver's language: everything they read and hear. */
  briefLang: Lang;
  /** Youth's language: the screen shown after the phone comes back. */
  lang: Lang;
  audience: Audience;
  onClose: () => void;
  onReport: () => void;
};

type Stage = "intro" | number | "respond" | "moment" | "call" | "thanks" | "child";

const CALLS = [
  { name: "SOS", note: "24h", number: "1767" },
  { name: "Police", note: "Emergency", number: "999" },
  { name: "ScamShield", note: "24/7", number: "1799" },
  { name: "Mindline", note: "Mental health", number: "1771" },
];

/**
 * "Hand to Mum" mode. The youth passes the phone to a caregiver, who is walked through the note
 * one calm, large-print, read-aloud slide at a time in their own language, then chooses a response.
 * That response is shown back to the youth in THEIR language, closing the loop.
 */
export function Handoff({ brief, briefLang, lang, audience, onClose, onReport }: Props) {
  const h = T[briefLang].handoff;
  const c = T[briefLang].card;
  const youth = T[lang].handoff;
  const { speak, stop, speaking, available } = useSpeech(briefLang);
  const [stage, setStage] = useState<Stage>("intro");
  const [autoRead, setAutoRead] = useState(true);

  const slides: { title: string; body?: string; list?: string[]; tone?: "do" | "avoid"; quote?: boolean }[] = [
    { title: c.fromChild, body: brief.openingLine, quote: true },
    { title: c.whatHappened, body: brief.whatHappened },
    { title: c.notTheirFault, body: brief.notTheirFault },
    { title: c.doNow, list: brief.doNow, tone: "do" },
    { title: c.avoid, list: brief.avoid, tone: "avoid" },
  ];
  const slideText = (i: number) => [slides[i].title, slides[i].body, ...(slides[i].list ?? [])].filter(Boolean).join(". ");

  // Each slide reads itself aloud (the tap on Next/Start counts as the user gesture browsers require).
  useEffect(() => {
    if (typeof stage === "number" && autoRead) speak(slideText(stage));
    else if (stage === "moment" && autoRead) speak(h.momentBody);
    else stop();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [stage]);

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const go = (s: Stage) => setStage(s);
  const progress = typeof stage === "number" ? stage + 1 : stage === "intro" ? 0 : slides.length;

  return (
    <div
      role="dialog"
      aria-modal="true"
      lang={stage === "child" ? lang : briefLang}
      className="fixed inset-0 z-50 flex flex-col bg-gradient-to-b from-lav-50 via-white to-sage-50"
    >
      {/* Top bar: progress + read-aloud toggle + close */}
      <div className="flex items-center justify-between gap-3 px-5 pt-5 md:px-10 md:pt-8">
        <div className="flex gap-1.5" aria-hidden>
          {slides.map((_, i) => (
            <span
              key={i}
              className={`h-2 rounded-full transition-all ${i < progress ? "w-8 bg-sage-500" : "w-2 bg-sage-200"}`}
            />
          ))}
        </div>
        <div className="flex items-center gap-2">
          {typeof stage === "number" && available && (
            <button
              onClick={() => {
                if (speaking) {
                  stop();
                  setAutoRead(false);
                } else {
                  setAutoRead(true);
                  speak(slideText(stage));
                }
              }}
              className="rounded-full bg-white px-4 py-2 text-base font-semibold text-sage-700 shadow-sm"
            >
              {speaking ? `⏹ ${h.stop}` : `🔊 ${h.listen}`}
            </button>
          )}
          <button
            onClick={() => (stop(), onClose())}
            aria-label={T[lang].close}
            className="rounded-full bg-white px-3.5 py-2 text-base text-muted shadow-sm"
          >
            ✕
          </button>
        </div>
      </div>

      {/* Body */}
      <div className="flex flex-1 flex-col items-center justify-center overflow-y-auto px-6 py-6 md:px-12">
        <div key={String(stage)} className="rise w-full max-w-2xl">
          {stage === "intro" && (
            <div className="text-center">
              <div className="breathe mx-auto mb-8 w-fit">
                <ShieldIcon size={112} />
              </div>
              <h1 className="text-3xl font-semibold leading-snug md:text-5xl md:leading-tight">{h.introTitle}</h1>
              <p className="mt-5 text-xl leading-relaxed text-muted md:text-2xl">{h.introBody}</p>
            </div>
          )}

          {typeof stage === "number" && (
            <div>
              <p className="mb-4 text-base font-semibold uppercase tracking-wide text-lav-600 md:text-lg">{slides[stage].title}</p>
              {slides[stage].body &&
                (slides[stage].quote ? (
                  <blockquote className="rounded-3xl bg-lav-100 p-6 text-3xl font-medium leading-snug text-lav-600 md:p-10 md:text-5xl md:leading-tight">
                    “{slides[stage].body}”
                  </blockquote>
                ) : (
                  <p className="text-2xl leading-relaxed md:text-4xl md:leading-snug">{slides[stage].body}</p>
                ))}
              {slides[stage].list && (
                <ul className="space-y-4 md:space-y-6">
                  {slides[stage].list!.map((item) => (
                    <li key={item} className="flex gap-4 rounded-3xl bg-white p-5 text-xl leading-relaxed shadow-sm md:text-3xl md:leading-snug">
                      <span className={`shrink-0 ${slides[stage].tone === "do" ? "text-sage-600" : "text-rose-ink"}`}>
                        {slides[stage].tone === "do" ? "✓" : "✕"}
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              )}
              {!available && <p className="mt-6 text-base text-muted">{h.readScreen}</p>}
            </div>
          )}

          {stage === "respond" && (
            <div>
              <h2 className="mb-6 text-center text-3xl font-semibold md:text-5xl">{h.respondTitle}</h2>
              <div className="space-y-4">
                <BigChoice onClick={() => go("thanks")} tone="primary" icon="🤝" label={h.respondHere} />
                <BigChoice onClick={() => go("call")} icon="📞" label={h.respondCall} />
                <BigChoice onClick={() => go("moment")} icon="🌿" label={h.respondMoment} />
              </div>
            </div>
          )}

          {stage === "moment" && (
            <div className="text-center">
              <div className="breathe mx-auto mb-8 flex size-40 items-center justify-center rounded-full bg-sage-100 md:size-56">
                <ShieldIcon size={88} />
              </div>
              <p className="text-2xl leading-relaxed md:text-4xl md:leading-snug">{h.momentBody}</p>
            </div>
          )}

          {stage === "call" && (
            <div>
              <h2 className="mb-6 text-center text-3xl font-semibold md:text-4xl">{h.callTitle}</h2>
              <div className="grid grid-cols-2 gap-4">
                {CALLS.map((x) => (
                  <a
                    key={x.number}
                    href={`tel:${x.number}`}
                    className="rounded-3xl bg-white p-5 text-center shadow-sm hover:bg-sage-50 md:p-8"
                  >
                    <div className="text-4xl font-bold text-sage-700 md:text-5xl">{x.number}</div>
                    <div className="mt-1 text-lg font-semibold md:text-xl">{x.name}</div>
                    <div className="text-sm text-muted">{x.note}</div>
                  </a>
                ))}
              </div>
            </div>
          )}

          {stage === "thanks" && (
            <div className="text-center">
              <div className="pop mx-auto mb-6 text-8xl md:text-9xl" aria-hidden>
                💚
              </div>
              <h2 className="text-3xl font-semibold leading-snug md:text-5xl md:leading-tight">{h.thanks}</h2>
              <p className="mt-6 text-5xl" aria-hidden>
                📱↩️
              </p>
            </div>
          )}

          {stage === "child" && (
            <div className="text-center">
              <div className="pop mx-auto mb-6 w-fit">
                <ShieldIcon size={104} />
              </div>
              <p className="text-lg font-semibold text-muted md:text-xl">{youth.replyFrom(T[lang].family.audiences[audience])}</p>
              <blockquote className="mx-auto mt-3 max-w-xl rounded-3xl bg-sage-100 p-6 text-3xl font-semibold leading-snug text-sage-700 md:text-4xl">
                “{youth.respondHere}”
              </blockquote>
              <p className="mt-6 text-xl leading-relaxed md:text-2xl">{youth.brave}</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom actions */}
      <div className="px-5 pb-6 md:px-10 md:pb-10">
        <div className="mx-auto flex max-w-2xl gap-3">
          {stage === "intro" && <BigButton onClick={() => go(0)} label={`${h.begin} →`} primary />}
          {typeof stage === "number" && (
            <>
              <BigButton onClick={() => go(stage === 0 ? "intro" : stage - 1)} label={`← ${h.back}`} />
              <BigButton onClick={() => go(stage === slides.length - 1 ? "respond" : stage + 1)} label={`${h.next} →`} primary />
            </>
          )}
          {stage === "respond" && <BigButton onClick={() => go(slides.length - 1)} label={`← ${h.back}`} />}
          {(stage === "moment" || stage === "call") && <BigButton onClick={() => go("respond")} label={`← ${h.back}`} />}
          {stage === "thanks" && <BigButton onClick={() => go("child")} label={`${youth.next} →`} primary />}
          {stage === "child" && (
            <>
              <BigButton onClick={onClose} label={youth.done} />
              <BigButton onClick={onReport} label={`${youth.nextReport} →`} primary />
            </>
          )}
        </div>
      </div>
    </div>
  );
}

function BigButton({ onClick, label, primary }: { onClick: () => void; label: string; primary?: boolean }) {
  return (
    <button
      onClick={onClick}
      className={`flex-1 rounded-3xl px-5 py-5 text-lg font-semibold md:py-6 md:text-2xl ${
        primary ? "bg-sage-600 text-white shadow-lg shadow-sage-200 hover:bg-sage-700" : "bg-white text-ink shadow-sm hover:bg-sage-50"
      }`}
    >
      {label}
    </button>
  );
}

function BigChoice({ onClick, icon, label, tone }: { onClick: () => void; icon: string; label: string; tone?: "primary" }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-4 rounded-3xl p-5 text-left text-xl font-semibold md:p-7 md:text-3xl ${
        tone === "primary" ? "bg-sage-600 text-white shadow-lg shadow-sage-200" : "bg-white text-ink shadow-sm hover:bg-sage-50"
      }`}
    >
      <span className="text-3xl md:text-4xl" aria-hidden>
        {icon}
      </span>
      {label}
    </button>
  );
}
