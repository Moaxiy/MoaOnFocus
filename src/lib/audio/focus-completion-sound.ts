"use client";

type ToneStep = {
  duration: number;
  frequency: number;
  offset: number;
  volume: number;
};

const BRIGHT_CHIME_STEPS: ToneStep[] = [
  { offset: 0, duration: 0.11, frequency: 1046.5, volume: 0.18 },
  { offset: 0.15, duration: 0.11, frequency: 1318.51, volume: 0.18 },
  { offset: 0.3, duration: 0.13, frequency: 1567.98, volume: 0.17 },
  { offset: 0.5, duration: 0.25, frequency: 2093, volume: 0.16 },
];

let audioContext: AudioContext | null = null;
let lastPlayedAt = 0;

function getAudioContext() {
  if (typeof window === "undefined") {
    return null;
  }

  const AudioContextConstructor =
    window.AudioContext ||
    (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;

  if (!AudioContextConstructor) {
    return null;
  }

  if (!audioContext) {
    audioContext = new AudioContextConstructor();
  }

  return audioContext;
}

function scheduleTone(
  context: AudioContext,
  step: ToneStep,
  destination: GainNode,
  startAt: number,
) {
  const toneStart = startAt + step.offset;
  const toneEnd = toneStart + step.duration;
  const partials = [
    { type: "triangle" as OscillatorType, ratio: 1, gain: step.volume },
    { type: "sine" as OscillatorType, ratio: 2, gain: step.volume * 0.34 },
    { type: "triangle" as OscillatorType, ratio: 4, gain: step.volume * 0.1 },
  ];

  for (const partial of partials) {
    const oscillator = context.createOscillator();
    const gain = context.createGain();

    oscillator.type = partial.type;
    oscillator.frequency.setValueAtTime(step.frequency * partial.ratio, toneStart);

    gain.gain.setValueAtTime(0.0001, toneStart);
    gain.gain.exponentialRampToValueAtTime(partial.gain, toneStart + 0.012);
    gain.gain.exponentialRampToValueAtTime(0.0001, toneEnd);

    oscillator.connect(gain);
    gain.connect(destination);
    oscillator.start(toneStart);
    oscillator.stop(toneEnd + 0.06);
  }
}

export async function primeCompletionSound() {
  const context = getAudioContext();
  if (!context) {
    return false;
  }

  try {
    if (context.state === "suspended") {
      await context.resume();
    }

    return context.state === "running";
  } catch {
    return false;
  }
}

export async function playCompletionSound() {
  const context = getAudioContext();
  if (!context) {
    return false;
  }

  if (Date.now() - lastPlayedAt < 1500) {
    return false;
  }

  try {
    if (context.state === "suspended") {
      await context.resume();
    }

    if (context.state !== "running") {
      return false;
    }

    const masterGain = context.createGain();
    const startAt = context.currentTime + 0.02;

    masterGain.gain.setValueAtTime(0.95, startAt);
    masterGain.connect(context.destination);

    for (const step of BRIGHT_CHIME_STEPS) {
      scheduleTone(context, step, masterGain, startAt);
    }

    lastPlayedAt = Date.now();

    window.setTimeout(() => {
      try {
        masterGain.disconnect();
      } catch {
        // Ignore cleanup failures after playback ends.
      }
    }, 1100);

    return true;
  } catch {
    return false;
  }
}
