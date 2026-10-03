/**
 * Privacy-by-design: strip Singapore-specific personal identifiers BEFORE text leaves the device.
 * The AI never needs a NRIC, phone number or bank account to comfort someone or draft a report.
 */
const RULES: { re: RegExp; tag: string }[] = [
  { re: /\b[STFGM]\d{7}[A-Z]\b/gi, tag: "[NRIC]" },
  { re: /[\w.+-]+@[\w-]+\.[\w.-]+/g, tag: "[EMAIL]" },
  { re: /(\+?65[\s-]?)?\b[3689]\d{3}[\s-]?\d{4}\b/g, tag: "[PHONE]" },
  { re: /\b\d{3}-?\d{5,6}-?\d{1,3}\b/g, tag: "[BANK_ACCOUNT]" },
  { re: /\b(?:\d{4}[\s-]?){3}\d{4}\b/g, tag: "[CARD]" },
  { re: /\b(blk|block)\s*\d+[a-z]?\b[^,.!?\n]{0,60}/gi, tag: "[ADDRESS]" },
  { re: /#\d{1,3}-\d{1,4}\b/g, tag: "[UNIT]" },
  { re: /\b(?:Singapore\s*)?\d{6}\b(?=\s|$|[.,])/g, tag: "[POSTAL]" },
];

export function redact(text: string): { text: string; count: number } {
  let count = 0;
  let out = text;
  for (const { re, tag } of RULES) {
    out = out.replace(re, () => {
      count++;
      return tag;
    });
  }
  return { text: out, count };
}
