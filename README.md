# MindShield SG

**A safe first step for young people facing online harms: calm down, get help, bring your family in.**

Built for the GovTech Digital4Good *Online Safety Hack* (Track: Mental Health & Online Harms / Gen AI for Good).

> When a 15-year-old in Singapore is sextorted on Telegram, the scariest part often isn't the threat. It's telling their parents.
> And since 29 June 2026, an Online Safety Commission report for an under-18 is filed by a **parent or guardian**.
> So the family conversation isn't optional. It's the route to help. MindShield makes that conversation possible.

## What it does

| Tab | What happens | Why judges care |
|---|---|---|
| 🏠 **Home** | Pick EN / 中文 / Melayu / தமிழ், pick how you feel, get a 10-second grounding cue, tap a scenario or type | Inclusive across Singapore's 4 official languages; trauma-informed |
| 💬 **Talk** | A warm peer AI that removes shame first, then gives one concrete next step | GenAI used for de-escalation, not diagnosis |
| 👨‍👩‍👧 **Family** | "Help me tell my family": a calm, blame-free note for Mum / Dad / Grandparent / Teacher **in their language**, with **read-aloud** for elderly or low-literacy caregivers | Intergenerational bridge (Kebun Baru, Digital for Life) |
| 🛡️ **Act** | Evidence checklist, **routing that follows OSC rules** (which harms go direct, which need a platform report first), and an editable incident summary to download as PDF or print | Plugs into existing national infrastructure (OSC, SPF, ScamShield) |

### Safety & privacy by design (the "not just a wrapper" slide)
1. **Deterministic crisis guardrail.** Multilingual regex runs *in the browser before any network call* and again on the server. Self-harm language pins SOS 1767 / CareText 9151 1767 instantly, even if the AI is down. It deliberately over-triggers: a false positive shows a hotline card, while a false negative could cost a life.
2. **On-device PII redaction.** NRIC, phone, email, bank/card numbers, block/unit addresses and postal codes become `[NRIC]`, `[PHONE]` and so on *before* text leaves the phone. The user sees "1 personal detail hidden". The server re-redacts anyway.
3. **Nothing stored.** No DB, no cookies, no localStorage. **Quick exit** wipes state and replaces the page with a Google weather search, so the Back button can't return.
4. **Prompt-level rules.** The AI never asks for identifiers, never says to pay or negotiate, and never suggests deleting evidence. It routes, it doesn't diagnose.
5. **Never dies on stage.** No API key, or a slow API → hand-written **demo mode** replies in all 4 languages.

## Run it

```bash
npm install
npm run dev          # http://localhost:3000
```

Works immediately in **demo mode**. For live AI, copy `.env.example` to `.env.local` and set **one** key:

```bash
GEMINI_API_KEY=...   # default model gemini-2.5-flash
# or
OPENAI_API_KEY=...   # default model gpt-4o-mini
```

Deploy: push to a GitHub repo, import it on Vercel, and add the key as an env var. Judges can then open it on their phones.

## 90-second demo script

1. **Home** → choose English → tap 😨 *Scared* (grounding cue appears) → tap **"Someone is threatening to leak my photos"**.
2. **Talk** → AI names it (sextortion), says *not your fault*, *don't pay*, and asks for screenshots.
   Type: `honestly i just want to end it all, my number is 91234567`
   → the **crisis banner** appears instantly, and the phone number shows as `[PHONE]` with "1 personal detail hidden".
3. Tap **Help me tell my family** → *Grandparent* → **中文** (or தமிழ்) → *Create the note* → **🔊 Read aloud**.
4. Tap **Act** → tick the checklist → *Build summary* → show OSC routing ("report directly, no platform first") → **Download PDF**.
5. Close on **Quick exit**.

## Project layout

```
app/page.tsx            state + flow (all in memory)
app/api/chat            peer chat  → LLM or demo
app/api/brief           family note (JSON) in caregiver's language
app/api/incident        structured incident extraction (JSON)
components/             Home / Talk / Family / Action screens + shell
lib/guardrails.ts       multilingual crisis + harm-type detection
lib/redact.ts           Singapore PII redaction
lib/prompts.ts          system prompts (edit tone here)
lib/resources.ts        hotlines + OSC-aware routing (single source of truth)
lib/demo.ts             offline scripted replies in 4 languages
lib/i18n.ts             UI strings EN / ZH / MS / TA
```

## Before showing real users
- Have **native speakers review** the Mandarin, Malay and Tamil copy (`lib/i18n.ts`, `lib/demo.ts`).
- Re-verify every hotline in `lib/resources.ts` (last checked Oct 2026).
- This is a prototype and is not a substitute for professional help.
