import type { ToastType } from "./types";

let audioContext: AudioContext | null = null;

function getAudioContext(): AudioContext | null {
  if (typeof window === "undefined") return null;
  if (!audioContext) {
    try {
      audioContext = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    } catch {
      return null;
    }
  }
  return audioContext;
}

function playTone(frequency: number, duration: number, type: OscillatorType = "sine"): void {
  const ctx = getAudioContext();
  if (!ctx) return;

  try {
    const oscillator = ctx.createOscillator();
    const gain = ctx.createGain();
    oscillator.connect(gain);
    gain.connect(ctx.destination);
    oscillator.frequency.value = frequency;
    oscillator.type = type;
    gain.gain.setValueAtTime(0.08, ctx.currentTime);
    gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + duration);
    oscillator.start(ctx.currentTime);
    oscillator.stop(ctx.currentTime + duration);
  } catch {
    // Ignore audio errors
  }
}

const SOUNDS: Record<ToastType, () => void> = {
  default: () => playTone(523, 0.08),
  success: () => {
    playTone(523, 0.06);
    setTimeout(() => playTone(659, 0.06), 60);
    setTimeout(() => playTone(784, 0.1), 120);
  },
  error: () => {
    playTone(200, 0.15, "sawtooth");
    setTimeout(() => playTone(180, 0.2, "sawtooth"), 80);
  },
  warning: () => playTone(440, 0.12, "square"),
  info: () => playTone(698, 0.1),
  loading: () => playTone(392, 0.05),
};

export function playToastSound(type: ToastType): void {
  SOUNDS[type]?.();
}
