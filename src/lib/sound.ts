// Web Audio API sound generator and Web Speech API TTS for 100% offline Russian learning

let audioCtx: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AudioContextClass =
      window.AudioContext ||
      (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    if (AudioContextClass) {
      audioCtx = new AudioContextClass();
    }
  }
  if (audioCtx && audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function playSound(type: "correct" | "incorrect" | "levelup" | "click" | "tap"): void {
  try {
    const ctx = getAudioContext();
    if (!ctx) return;
    const now = ctx.currentTime;

    if (type === "correct") {
      // Pleasant double bell chime
      const osc1 = ctx.createOscillator();
      const osc2 = ctx.createOscillator();
      const gain = ctx.createGain();

      osc1.type = "sine";
      osc1.frequency.setValueAtTime(587.33, now); // D5
      osc1.frequency.exponentialRampToValueAtTime(880, now + 0.12); // A5

      osc2.type = "triangle";
      osc2.frequency.setValueAtTime(880, now + 0.1);
      osc2.frequency.exponentialRampToValueAtTime(1174.66, now + 0.28); // D6

      gain.gain.setValueAtTime(0.18, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc1.connect(gain);
      osc2.connect(gain);
      gain.connect(ctx.destination);

      osc1.start(now);
      osc2.start(now + 0.08);
      osc1.stop(now + 0.35);
      osc2.stop(now + 0.35);
    } else if (type === "incorrect") {
      // Gentle double buzz
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sawtooth";
      osc.frequency.setValueAtTime(180, now);
      osc.frequency.setValueAtTime(140, now + 0.1);

      gain.gain.setValueAtTime(0.15, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.28);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.28);
    } else if (type === "levelup") {
      // Fanfare arpeggio
      const notes = [523.25, 659.25, 783.99, 1046.5]; // C5, E5, G5, C6
      notes.forEach((freq, index) => {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        const startTime = now + index * 0.08;

        osc.type = "sine";
        osc.frequency.setValueAtTime(freq, startTime);

        gain.gain.setValueAtTime(0.2, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + 0.3);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(startTime);
        osc.stop(startTime + 0.32);
      });
    } else if (type === "click" || type === "tap") {
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = "sine";
      osc.frequency.setValueAtTime(800, now);
      gain.gain.setValueAtTime(0.04, now);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.04);
    }
  } catch {
    /* Audio context not supported or user has not interacted yet */
  }
}

/** Multi-language Text-To-Speech using browser Web Speech API */
export function speakText(text: string, speed: number = 0.85): void {
  if (typeof window === "undefined" || !("speechSynthesis" in window)) return;

  // Clean text from gap markers, slashes, or stress marks
  const cleanText = text.replace(/_{2,}/g, "").replace(/[/\\]/g, " ").trim();
  if (!cleanText) return;

  const isRu = /[\u0400-\u04FF]/.test(cleanText);

  window.speechSynthesis.cancel();
  const utterance = new SpeechSynthesisUtterance(cleanText);
  utterance.lang = isRu ? "ru-RU" : "en-US";
  utterance.rate = isRu ? speed : 1.0;
  utterance.pitch = 1.0;

  const voices = window.speechSynthesis.getVoices();
  if (isRu) {
    const russianVoice = voices.find(
      (v) => v.lang.startsWith("ru") || v.name.includes("Russian") || v.name.includes("Русский"),
    );
    if (russianVoice) {
      utterance.voice = russianVoice;
    }
  } else {
    const englishVoice = voices.find(
      (v) => v.lang.startsWith("en") || v.name.includes("English") || v.name.includes("Samantha") || v.name.includes("Google US"),
    );
    if (englishVoice) {
      utterance.voice = englishVoice;
    }
  }

  window.speechSynthesis.speak(utterance);
}

/** Russian Text-To-Speech shortcut */
export function speakRussian(text: string, speed: number = 0.85): void {
  speakText(text, speed);
}

/** Cyrillic Letter pronunciation (speaks character sound or official name for signs) */
export function speakCyrillicLetter(char: string, speed: number = 0.85): void {
  const clean = char.trim();
  if (clean === "Ъ" || clean === "ъ" || clean.includes("Твёрдый")) {
    speakRussian("Твёрдый знак", speed);
  } else if (clean === "Ь" || clean === "ь" || clean.includes("Мягкий")) {
    speakRussian("Мягкий знак", speed);
  } else {
    speakRussian(clean, speed);
  }
}
