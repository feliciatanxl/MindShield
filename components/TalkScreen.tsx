"use client";

import { useEffect, useRef, useState } from "react";
import { T } from "@/lib/i18n";
import type { AiMode, ChatMessage, Lang } from "@/lib/types";
import { Spinner } from "./Shell";

type Props = {
  lang: Lang;
  messages: ChatMessage[];
  loading: boolean;
  redacted: number;
  mode: AiMode | null;
  onSend: (text: string) => void;
  goFamily: () => void;
  goAction: () => void;
};

export function TalkScreen({ lang, messages, loading, redacted, mode, onSend, goFamily, goAction }: Props) {
  const t = T[lang];
  const [draft, setDraft] = useState("");
  const end = useRef<HTMLDivElement>(null);

  useEffect(() => {
    end.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  const hasReply = messages.some((m) => m.role === "assistant");

  return (
    <div className="flex min-h-full flex-col">
      <div className="flex-1 space-y-3 px-4 py-4">
        {mode === "demo" && (
          <p className="text-center text-[11px] uppercase tracking-wide text-muted">{t.demoMode}</p>
        )}
        {!messages.length && <p className="pt-10 text-center text-sm text-muted">{t.emptyTalk}</p>}
        {messages.map((m, i) => (
          <div key={i} className={`rise flex ${m.role === "user" ? "justify-end" : "justify-start"}`}>
            <div
              className={`max-w-[85%] whitespace-pre-wrap rounded-3xl px-4 py-3 text-[15px] leading-relaxed ${
                m.role === "user" ? "rounded-br-md bg-sage-600 text-white" : "rounded-bl-md bg-white text-ink shadow-sm"
              }`}
            >
              {m.content}
            </div>
          </div>
        ))}
        {loading && (
          <div className="flex justify-start">
            <div className="rounded-3xl rounded-bl-md bg-white px-4 py-3 shadow-sm">
              <Spinner label={t.thinking} />
            </div>
          </div>
        )}
        {redacted > 0 && (
          <p className="rise text-right text-xs text-sage-700">🔒 {t.redacted(redacted)}</p>
        )}
        {hasReply && !loading && (
          <div className="rise grid grid-cols-2 gap-2 pt-1">
            <button onClick={goFamily} className="rounded-2xl bg-lav-100 px-3 py-3 text-sm font-semibold text-lav-600 hover:bg-lav-200">
              👨‍👩‍👧 {t.familyCta}
            </button>
            <button onClick={goAction} className="rounded-2xl bg-sage-100 px-3 py-3 text-sm font-semibold text-sage-700 hover:bg-sage-200">
              🛡️ {t.reportCta}
            </button>
          </div>
        )}
        <div ref={end} />
      </div>

      <form
        className="sticky bottom-[60px] flex gap-2 border-t border-sage-100 bg-white/90 px-4 py-3 backdrop-blur"
        onSubmit={(e) => {
          e.preventDefault();
          if (!draft.trim() || loading) return;
          onSend(draft.trim());
          setDraft("");
        }}
      >
        <input
          value={draft}
          onChange={(e) => setDraft(e.target.value)}
          placeholder={t.placeholder}
          aria-label={t.placeholder}
          className="min-w-0 flex-1 rounded-2xl border border-sage-200 bg-white px-4 py-3 text-sm outline-none focus:border-sage-500"
        />
        <button
          className="rounded-2xl bg-sage-600 px-4 text-sm font-semibold text-white disabled:opacity-40"
          disabled={!draft.trim() || loading}
        >
          {t.send}
        </button>
      </form>
    </div>
  );
}
