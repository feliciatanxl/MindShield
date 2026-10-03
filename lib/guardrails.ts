import type { Category } from "./types";

/**
 * Deterministic safety layer. Runs in the browser BEFORE any network call, and again on the server,
 * so crisis resources appear instantly and never depend on the LLM behaving.
 * Keyword lists cover EN / Singlish, Mandarin, Malay and Tamil. Intentionally over-inclusive:
 * a false positive shows a hotline card; a false negative could cost a life.
 */
const CRISIS: RegExp[] = [
  /\b(kill|hurt|cut|harm)\s*(my\s*self|myself)\b/i,
  /\b(end|take)\s+(my\s+(own\s+)?life|it\s+all)\b/i,
  /\bwant(ed)?\s+to\s+die\b/i,
  /\b(suicid|self[-\s]?harm)/i,
  /\b(no (point|reason) (in )?(living|to live)|better off dead|don'?t want to (live|be alive|wake up))\b/i,
  /\b(jump|jumping)\s+(off|down)\b/i,
  /\bsian\s+until\s+(want|wan)\s+to\s+die\b/i,
  /自杀|想死|不想活|结束(自己的)?生命|自残|割腕|跳楼|活不下去/,
  /bunuh\s+diri|nak\s+mati|mahu\s+mati|ingin\s+mati|tak\s+(nak|mahu)\s+hidup|cederakan\s+diri|terjun/i,
  /தற்கொலை|சாக\s*வேண்டும்|சாகணும்|சாகப்\s*போகிறேன்|வாழ\s*விரும்பவில்லை|உயிரை\s*மாய்/,
];

const CATEGORY_RULES: { cat: Category; re: RegExp }[] = [
  {
    cat: "intimate",
    re: /\b(nudes?|naked|intimate|sextort|private (photos?|pics?|videos?)|leak (my|the) (photos?|pics?|videos?)|explicit|deepfake (porn|nude)|sexual)\b|裸照|私密(照|视频)|不雅|色情|gambar\s+(bogel|lucah|peribadi)|video\s+lucah|நிர்வாண|அந்தரங்க|தனிப்பட்ட\s+புகைப்பட/i,
  },
  {
    cat: "doxxing",
    re: /\b(dox+(ed|ing)?|home address|my address|personal (info|details|information)|posted my (name|school|address|number)|ic number|nric)\b|人肉|地址|个人资料|住址|alamat|maklumat\s+peribadi|முகவரி|தனிப்பட்ட\s+தகவல்/i,
  },
  {
    cat: "scam",
    re: /\b(scam+(ed|er|mer)?|transferr?(ed)?|paynow|bank|training fee|deposit|crypto|investment|job offer|part[-\s]?time job|otp|singpass)\b|诈骗|被骗|骗子|转账|兼职|tipu|penipuan|pindah(kan)?\s+wang|kerja\s+sambilan|மோசடி|ஏமாற்ற|பணம்\s+அனுப்ப/i,
  },
  {
    cat: "harassment",
    re: /\b(bull(y|ied|ying)|harass|stalk|hate (page|comments?)|make fun|mock(ing)?|rumou?rs?|threat(en)?|group chat|edited pictures?|insult|cyberbull)\b|欺负|霸凌|骚扰|取笑|恶搞|跟踪|buli|ganggu|ejek|hendap|கேலி|தொல்லை|மிரட்ட|பின்தொடர/i,
  },
];

export function detectCrisis(text: string): boolean {
  return CRISIS.some((re) => re.test(text));
}

/** Highest-severity category wins: intimate image abuse > doxxing > scam > harassment. */
export function detectCategory(text: string): Category {
  for (const { cat, re } of CATEGORY_RULES) if (re.test(text)) return cat;
  return "general";
}
