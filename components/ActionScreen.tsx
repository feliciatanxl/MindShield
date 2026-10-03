"use client";

import { useState } from "react";
import { T } from "@/lib/i18n";
import { downloadIncidentPdf } from "@/lib/pdf";
import { evidenceStatus, incidentText } from "@/lib/report";
import { CATEGORY_LABEL, ROUTES } from "@/lib/resources";
import type { Category, Incident, Lang } from "@/lib/types";
import { Spinner } from "./Shell";

type Props = {
  lang: Lang;
  hasChat: boolean;
  checked: boolean[];
  toggle: (i: number) => void;
  incident: Incident | null;
  setIncident: (i: Incident) => void;
  loading: boolean;
  onBuild: () => void;
  fallbackCategory: Category;
};

const URGENCY_STYLE = {
  high: "bg-rose-soft text-rose-ink",
  medium: "bg-lav-100 text-lav-600",
  low: "bg-sage-100 text-sage-700",
};

export function ActionScreen(p: Props) {
  const t = T[p.lang].action;
  const done = p.checked.filter(Boolean).length;
  const category = p.incident?.category ?? p.fallbackCategory;
  const [saving, setSaving] = useState(false);
  const [copied, setCopied] = useState(false);
  const evidence = evidenceStatus(p.checked);
  const card = T[p.lang].card;

  function field<K extends keyof Incident>(k: K, v: Incident[K]) {
    if (p.incident) p.setIncident({ ...p.incident, [k]: v });
  }

  async function download() {
    if (!p.incident || saving) return;
    setSaving(true);
    try {
      await downloadIncidentPdf(p.incident, evidence);
    } finally {
      setSaving(false);
    }
  }

  async function copy() {
    if (!p.incident) return;
    await navigator.clipboard.writeText(incidentText(p.incident, evidence));
    setCopied(true);
    setTimeout(() => setCopied(false), 1500);
  }

  return (
    <div className="space-y-5 px-4 py-6 md:px-6">
      <section className="no-print">
        <h1 className="text-xl font-semibold">{t.title}</h1>
        <p className="mt-1 text-sm text-muted">{t.intro}</p>
      </section>

      <section className="no-print rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">📸 {t.checklistTitle}</h2>
          <span className="text-xs font-semibold text-sage-700">
            {done}/{t.checklist.length}
          </span>
        </div>
        <div className="mb-3 h-1.5 overflow-hidden rounded-full bg-sage-100">
          <div className="h-full bg-sage-500 transition-all" style={{ width: `${(done / t.checklist.length) * 100}%` }} />
        </div>
        <ul className="space-y-2">
          {t.checklist.map((item, i) => (
            <li key={i}>
              <label className="flex cursor-pointer gap-3 rounded-xl p-2 text-sm hover:bg-sage-50">
                <input type="checkbox" checked={p.checked[i]} onChange={() => p.toggle(i)} className="mt-0.5 size-4 accent-sage-600" />
                <span className={p.checked[i] ? "text-muted line-through" : ""}>{item}</span>
              </label>
            </li>
          ))}
        </ul>
      </section>

      <section className="no-print rounded-3xl bg-white p-5 shadow-sm">
        <h2 className="mb-3 font-semibold">🧭 {t.routeTitle}</h2>
        <p className="mb-3 inline-block rounded-full bg-sage-50 px-3 py-1 text-xs font-medium text-sage-700">
          {CATEGORY_LABEL[category]}
        </p>
        <ol className="space-y-2">
          {ROUTES[category].map((r) => (
            <li key={r.step} className="rounded-2xl border border-sage-100 p-3 text-sm">
              <div>{r.step}</div>
              {r.where &&
                (r.href ? (
                  <a href={r.href} target="_blank" rel="noreferrer" className="mt-1 inline-block font-semibold text-sage-700 underline">
                    {r.where} ↗
                  </a>
                ) : (
                  <div className="mt-1 font-semibold text-sage-700">{r.where}</div>
                ))}
            </li>
          ))}
        </ol>
        <p className="mt-3 rounded-2xl bg-lav-50 p-3 text-xs leading-relaxed text-lav-600">👨‍👩‍👧 {t.under18}</p>
      </section>

      <section className="print-area rounded-3xl bg-white p-5 shadow-sm">
        <div className="mb-3 flex items-center justify-between">
          <h2 className="font-semibold">📝 {t.reportTitle}</h2>
          {p.incident && (
            <span className={`rounded-full px-2.5 py-0.5 text-xs font-semibold uppercase ${URGENCY_STYLE[p.incident.urgency]}`}>
              {p.incident.urgency}
            </span>
          )}
        </div>

        {!p.incident && (
          <button
            onClick={p.onBuild}
            disabled={!p.hasChat || p.loading}
            className="no-print w-full rounded-2xl bg-sage-600 py-3.5 text-sm font-semibold text-white disabled:opacity-40"
          >
            {p.loading ? <Spinner label="…" /> : `✨ ${t.build}`}
          </button>
        )}
        {!p.hasChat && !p.incident && <p className="mt-2 text-xs text-muted">{T[p.lang].family.needChat}</p>}

        {p.incident && (
          <div className="rise space-y-3 text-sm">
            <Field label={t.fields.category}>
              <select
                value={p.incident.category}
                onChange={(e) => field("category", e.target.value as Category)}
                className="w-full rounded-xl border border-sage-200 bg-white px-3 py-2"
              >
                {(Object.keys(CATEGORY_LABEL) as Category[]).map((c) => (
                  <option key={c} value={c}>
                    {CATEGORY_LABEL[c]}
                  </option>
                ))}
              </select>
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={t.fields.platform}>
                <Input value={p.incident.platform} onChange={(v) => field("platform", v)} />
              </Field>
              <Field label={t.fields.firstSeen}>
                <Input value={p.incident.firstSeen} onChange={(v) => field("firstSeen", v)} />
              </Field>
            </div>
            <Field label={t.fields.handles}>
              <Input
                value={p.incident.handles.join(", ")}
                placeholder="@username"
                onChange={(v) => field("handles", v.split(",").map((s) => s.trim()).filter(Boolean))}
              />
            </Field>
            <Field label={t.fields.demands}>
              <Input value={p.incident.demands} onChange={(v) => field("demands", v)} />
            </Field>
            <Field label={t.fields.summary}>
              <textarea
                value={p.incident.summary}
                onChange={(e) => field("summary", e.target.value)}
                rows={5}
                className="w-full rounded-xl border border-sage-200 px-3 py-2 leading-relaxed"
              />
            </Field>
            <p className="rounded-xl bg-sage-50 px-3 py-2 text-xs text-sage-700">📸 {evidence}</p>
            <div className="no-print grid grid-cols-2 gap-2 pt-1">
              <button
                onClick={download}
                disabled={saving}
                className="rounded-2xl bg-sage-600 py-2.5 text-sm font-semibold text-white disabled:opacity-60"
              >
                {saving ? <Spinner label="…" /> : `⬇ ${t.download} PDF`}
              </button>
              <button onClick={copy} className="rounded-2xl bg-sage-100 py-2.5 text-sm font-semibold text-sage-700 hover:bg-sage-200">
                {copied ? `✓ ${card.copied}` : `📋 ${card.copy}`}
              </button>
              <button onClick={() => window.print()} className="rounded-2xl border border-sage-200 py-2.5 text-sm font-semibold text-sage-700">
                🖨 {t.print}
              </button>
              <button onClick={p.onBuild} className="rounded-2xl border border-sage-200 py-2.5 text-sm font-semibold text-sage-700">
                ↻
              </button>
            </div>
          </div>
        )}
      </section>
    </div>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="block">
      <span className="mb-1 block text-xs font-semibold uppercase tracking-wide text-muted">{label}</span>
      {children}
    </label>
  );
}

function Input({ value, onChange, placeholder }: { value: string; onChange: (v: string) => void; placeholder?: string }) {
  return (
    <input
      value={value}
      placeholder={placeholder}
      onChange={(e) => onChange(e.target.value)}
      className="w-full rounded-xl border border-sage-200 px-3 py-2"
    />
  );
}

