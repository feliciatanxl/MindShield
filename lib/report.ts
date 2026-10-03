import { CATEGORY_LABEL, ROUTES } from "./resources";
import type { Incident } from "./types";

/** Evidence status in English (for authorities), derived from the first three checklist items. */
export function evidenceStatus(checked: boolean[]): string {
  const parts = [
    checked[0] ? "Screenshots saved" : "Screenshots NOT yet saved",
    checked[1] ? "chat kept (not deleted)" : null,
    checked[2] ? "reported & blocked on platform" : "not yet reported to platform",
  ];
  return parts.filter(Boolean).join("; ");
}

/** Plain-text version for pasting into SPF e-Services, ScamShield, OSC or school forms. */
export function incidentText(i: Incident, evidence: string): string {
  return [
    "INCIDENT SUMMARY (prepared with MindShield SG)",
    `Prepared: ${new Date().toLocaleString("en-SG")}`,
    "",
    `Type of harm: ${CATEGORY_LABEL[i.category]}`,
    `Urgency: ${i.urgency.toUpperCase()}`,
    `Platform: ${i.platform}`,
    `Account(s) involved: ${i.handles.join(", ") || "Unknown"}`,
    `When it started: ${i.firstSeen}`,
    `What they want: ${i.demands}`,
    `Evidence: ${evidence}`,
    "",
    "What happened:",
    i.summary,
    "",
    "Where to report:",
    ...ROUTES[i.category].map((r) => `- ${r.step}${r.where ? `: ${r.where}` : ""}${r.href?.startsWith("http") ? ` (${r.href})` : ""}`),
  ].join("\n");
}
