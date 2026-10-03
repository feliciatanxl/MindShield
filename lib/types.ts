export type Lang = "en" | "zh" | "ms" | "ta";

export type Category = "intimate" | "doxxing" | "scam" | "harassment" | "general";

export type ChatMessage = { role: "user" | "assistant"; content: string };

export type Audience = "mum" | "dad" | "grandparent" | "teacher";

/** The "Help me tell my family" card. Written in the caregiver's language. */
export type FamilyBrief = {
  whatHappened: string;
  notTheirFault: string;
  doNow: string[];
  avoid: string[];
  openingLine: string;
};

/** A structured, redacted incident record the youth can hand to an adult or authority. */
export type Incident = {
  category: Category;
  platform: string;
  handles: string[];
  firstSeen: string;
  summary: string;
  demands: string;
  urgency: "high" | "medium" | "low";
};

export type AiMode = "live" | "demo";
