"use client";

import { useCallback, useEffect, useState } from "react";
import { LANGS } from "./i18n";
import type { Lang } from "./types";

/**
 * Read-aloud via the browser's built-in voices (no network, nothing leaves the device).
 * Slower rate so elderly listeners can follow. `available` is false when the device has no voice
 * for the language (common for Tamil/Malay on desktop); callers show a "read the screen" hint.
 */
export function useSpeech(lang: Lang) {
  const [speaking, setSpeaking] = useState(false);
  const [voices, setVoices] = useState<SpeechSynthesisVoice[]>([]);

  useEffect(() => {
    const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;
    if (!synth) return;
    const load = () => setVoices(synth.getVoices());
    load();
    synth.addEventListener("voiceschanged", load);
    return () => {
      synth.removeEventListener("voiceschanged", load);
      synth.cancel();
    };
  }, []);

  const code = LANGS.find((l) => l.id === lang)!.speech;
  const voice = voices.find((v) => v.lang.replace("_", "-").toLowerCase().startsWith(code.slice(0, 2)));
  const available = !!voice || (lang === "en" && voices.length > 0);

  const stop = useCallback(() => {
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  const speak = useCallback(
    (text: string) => {
      const synth = window.speechSynthesis;
      if (!synth || !available) return false;
      synth.cancel();
      const u = new SpeechSynthesisUtterance(text.replace(/[•✓✕]/g, ""));
      u.lang = code;
      if (voice) u.voice = voice;
      u.rate = 0.9;
      u.onend = () => setSpeaking(false);
      u.onerror = () => setSpeaking(false);
      synth.speak(u);
      setSpeaking(true);
      return true;
    },
    [available, code, voice]
  );

  return { speak, stop, speaking, available };
}
