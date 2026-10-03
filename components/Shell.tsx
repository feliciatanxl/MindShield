"use client";

import { HOTLINES } from "@/lib/resources";
import { T } from "@/lib/i18n";
import type { Lang } from "@/lib/types";

export type Tab = "home" | "talk" | "family" | "action";

export function Header({ lang, onExit, onHelp }: { lang: Lang; onExit: () => void; onHelp: () => void }) {
  const t = T[lang];
  return (
    <header className="no-print sticky top-0 z-20 flex items-center justify-between gap-2 border-b border-sage-100 bg-white/85 px-4 py-3 backdrop-blur">
      <div className="flex items-center gap-2">
        <ShieldIcon />
        <div className="leading-tight">
          <div className="whitespace-nowrap text-[15px] font-semibold">MindShield SG</div>
          <div className="hidden text-xs text-muted min-[420px]:block">{t.tagline}</div>
        </div>
      </div>
      <div className="flex items-center gap-2">
        <button
          onClick={onHelp}
          className="whitespace-nowrap rounded-full bg-lav-100 px-3 py-1.5 text-xs font-semibold text-lav-600 hover:bg-lav-200"
        >
          {t.getHelp}
        </button>
        <button
          onClick={onExit}
          title="Instantly leaves this site and clears everything"
          className="whitespace-nowrap rounded-full bg-ink px-3 py-1.5 text-xs font-semibold text-white hover:opacity-90"
        >
          ✕ {t.quickExit}
        </button>
      </div>
    </header>
  );
}

export function CrisisBanner({ lang, onMore }: { lang: Lang; onMore: () => void }) {
  const t = T[lang];
  return (
    <div role="alert" className="no-print rise mx-4 mt-3 rounded-2xl border border-rose-ink/20 bg-rose-soft p-4">
      <p className="font-semibold text-rose-ink">{t.crisisTitle}</p>
      <p className="mt-1 text-sm text-rose-ink/80">{t.crisisBody}</p>
      <div className="mt-3 grid grid-cols-2 gap-2">
        <a href="tel:1767" className="rounded-xl bg-rose-ink px-3 py-2 text-center text-sm font-semibold text-white">
          📞 SOS 1767
        </a>
        <a
          href="https://wa.me/6591511767"
          target="_blank"
          rel="noreferrer"
          className="rounded-xl border border-rose-ink/30 bg-white px-3 py-2 text-center text-sm font-semibold text-rose-ink"
        >
          💬 WhatsApp 9151 1767
        </a>
      </div>
      <button onClick={onMore} className="mt-2 text-xs font-medium text-rose-ink underline">
        999 · Mindline 1771 · more
      </button>
    </div>
  );
}

export function HotlineSheet({ lang, onClose }: { lang: Lang; onClose: () => void }) {
  const t = T[lang];
  return (
    <div className="fixed inset-0 z-40 flex items-end justify-center bg-ink/40 sm:items-center" onClick={onClose}>
      <div
        role="dialog"
        aria-label={t.hotlinesTitle}
        className="rise max-h-[85vh] w-full max-w-md overflow-y-auto rounded-t-3xl bg-white p-5 sm:rounded-3xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="mb-3 flex items-center justify-between">
          <h2 className="text-lg font-semibold">{t.hotlinesTitle}</h2>
          <button onClick={onClose} className="rounded-full px-3 py-1 text-sm text-muted hover:bg-sage-50">
            {t.close}
          </button>
        </div>
        <ul className="space-y-2">
          {HOTLINES.map((h) => (
            <li key={h.name}>
              <a
                href={h.href}
                target={h.href.startsWith("http") ? "_blank" : undefined}
                rel="noreferrer"
                className={`flex items-center justify-between gap-3 rounded-2xl border p-3 hover:bg-sage-50 ${
                  h.crisis ? "border-rose-ink/20" : "border-sage-100"
                }`}
              >
                <div>
                  <div className="text-sm font-semibold">{h.name}</div>
                  <div className="text-xs text-muted">{h.detail}</div>
                </div>
                <div className={`whitespace-nowrap text-sm font-semibold ${h.crisis ? "text-rose-ink" : "text-sage-700"}`}>
                  {h.contact}
                </div>
              </a>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

export function BottomNav({ lang, tab, setTab }: { lang: Lang; tab: Tab; setTab: (t: Tab) => void }) {
  const t = T[lang];
  const items: { id: Tab; icon: string; label: string }[] = [
    { id: "home", icon: "🏠", label: t.tabs.home },
    { id: "talk", icon: "💬", label: t.tabs.talk },
    { id: "family", icon: "👨‍👩‍👧", label: t.tabs.family },
    { id: "action", icon: "🛡️", label: t.tabs.action },
  ];
  return (
    <nav className="no-print sticky bottom-0 z-20 grid grid-cols-4 border-t border-sage-100 bg-white/90 backdrop-blur">
      {items.map((i) => (
        <button
          key={i.id}
          onClick={() => setTab(i.id)}
          aria-current={tab === i.id ? "page" : undefined}
          className={`flex flex-col items-center gap-0.5 py-2.5 text-xs ${
            tab === i.id ? "font-semibold text-sage-700" : "text-muted"
          }`}
        >
          <span className="text-lg" aria-hidden>
            {i.icon}
          </span>
          {i.label}
        </button>
      ))}
    </nav>
  );
}

export function ShieldIcon({ size = 32 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 32 32" aria-hidden>
      <path d="M16 3 5 7v8c0 7 4.7 12 11 14 6.3-2 11-7 11-14V7L16 3Z" fill="#c6dfcd" />
      <path d="M16 3 5 7v8c0 7 4.7 12 11 14V3Z" fill="#d9cff1" />
      <path d="M11.5 16.5c1.2 1.6 2.7 2.5 4.5 2.5s3.3-.9 4.5-2.5" stroke="#3b5e46" strokeWidth="1.8" fill="none" strokeLinecap="round" />
      <circle cx="12.5" cy="12.5" r="1.2" fill="#3b5e46" />
      <circle cx="19.5" cy="12.5" r="1.2" fill="#3b5e46" />
    </svg>
  );
}

export function Spinner({ label }: { label: string }) {
  return (
    <span className="inline-flex items-center gap-1 text-sm text-muted" aria-live="polite">
      <span className="dot">●</span>
      <span className="dot">●</span>
      <span className="dot">●</span>
      <span className="sr-only">{label}</span>
    </span>
  );
}
