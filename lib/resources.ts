import type { Category } from "./types";

/** Verified Oct 2026. Re-check numbers before any public launch. */
export type Hotline = { name: string; detail: string; contact: string; href: string; crisis?: boolean };

export const HOTLINES: Hotline[] = [
  { name: "Emergency (Police / Ambulance)", detail: "Immediate danger", contact: "999 / 995", href: "tel:999", crisis: true },
  { name: "Samaritans of Singapore (SOS)", detail: "24 hours, free", contact: "1767", href: "tel:1767", crisis: true },
  { name: "SOS CareText", detail: "24-hour WhatsApp text support", contact: "9151 1767", href: "https://wa.me/6591511767", crisis: true },
  { name: "National Mindline", detail: "Mental health support", contact: "1771", href: "tel:1771", crisis: true },
  { name: "Tinkle Friend", detail: "For primary-school children", contact: "1800 2744 788", href: "tel:18002744788" },
  { name: "CHAT (IMH)", detail: "Ages 16–30, text-based", contact: "imh.com.sg/CHAT", href: "https://www.imh.com.sg/CHAT" },
  { name: "SHECARES@SCWO", detail: "One-stop support for online harms", contact: "scwo.org.sg", href: "https://www.scwo.org.sg" },
  { name: "ScamShield Helpline", detail: "24/7 scam checks & bank connect", contact: "1799", href: "tel:1799" },
  { name: "Online Safety Commission", detail: "Report doxxing, image abuse, harassment, stalking", contact: "osc.gov.sg", href: "https://www.osc.gov.sg" },
];

export type Route = { step: string; where: string; href?: string; note?: string };

/**
 * Where to go next, by harm type. Encodes the Online Safety Commission's rules (from 29 Jun 2026):
 * doxxing and intimate-image abuse can go straight to OSC; harassment and stalking must be reported
 * to the platform first, then escalated to OSC if there's no adequate response within 24 hours.
 */
export const ROUTES: Record<Category, Route[]> = {
  intimate: [
    { step: "Report directly — no need to go to the platform first", where: "Online Safety Commission", href: "https://www.osc.gov.sg" },
    { step: "Threats or extortion are crimes — make a police report", where: "SPF e-Services (999 if in danger)", href: "https://eservices.police.gov.sg" },
    { step: "Free counselling & legal clinic", where: "SHECARES@SCWO", href: "https://www.scwo.org.sg" },
    { step: "Do not pay or send more. Payment rarely stops it.", where: "" },
  ],
  doxxing: [
    { step: "Report directly — no need to go to the platform first", where: "Online Safety Commission", href: "https://www.osc.gov.sg" },
    { step: "Report the post on the platform too, so it comes down faster", where: "Platform report button" },
    { step: "If anyone threatens to come to your home or school", where: "Police 999 / SPF e-Services", href: "https://eservices.police.gov.sg" },
  ],
  harassment: [
    { step: "1. Report the posts / group on the platform first", where: "Platform report button" },
    { step: "2. No proper response in 24 hours? Escalate", where: "Online Safety Commission", href: "https://www.osc.gov.sg" },
    { step: "If it's classmates, a counsellor can step in quietly", where: "School counsellor / Form teacher" },
  ],
  scam: [
    { step: "Call your bank NOW to freeze / recall the transfer", where: "Your bank's 24h hotline" },
    { step: "Check, get advice & be connected to your bank", where: "ScamShield Helpline 1799", href: "https://www.scamshield.gov.sg" },
    { step: "Make a police report", where: "SPF e-Services", href: "https://eservices.police.gov.sg" },
    { step: "Stop all contact. Never share OTPs or Singpass.", where: "" },
  ],
  general: [
    { step: "Talk it through with a professional", where: "National Mindline 1771", href: "tel:1771" },
    { step: "Someone at school who can help", where: "School counsellor" },
    { step: "Serious online harm (doxxing, image abuse, harassment, stalking)", where: "Online Safety Commission", href: "https://www.osc.gov.sg" },
  ],
};

export const CATEGORY_LABEL: Record<Category, string> = {
  intimate: "Intimate image abuse / sextortion",
  doxxing: "Doxxing (personal info exposed)",
  scam: "Scam / fraud",
  harassment: "Online harassment / bullying",
  general: "Other online harm",
};
