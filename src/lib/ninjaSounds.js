// Ninja Sound Engine — Web Audio API procedural sound effects
// No external files needed; all sounds generated at runtime.

let audioCtx = null;
let muted = false;

if (typeof window !== "undefined") {
  muted = localStorage.getItem("stealth_mode") === "true";
}

function getCtx() {
  if (typeof window === "undefined") return null;
  if (!audioCtx) {
    const AC = window.AudioContext || window.webkitAudioContext;
    if (!AC) return null;
    audioCtx = new AC();
  }
  if (audioCtx.state === "suspended") {
    audioCtx.resume().catch(() => {});
  }
  return audioCtx;
}

export function initNinjaSounds() {
  if (typeof window === "undefined") return;
  muted = localStorage.getItem("stealth_mode") === "true";
}

export function isMuted() {
  return muted;
}

export function setMuted(value) {
  muted = !!value;
  if (typeof window !== "undefined") {
    localStorage.setItem("stealth_mode", String(muted));
  }
}

// Katana slash — noise burst through sweeping bandpass filter
export function playSlash() {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.15;

  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(3000, now);
  filter.frequency.exponentialRampToValueAtTime(800, now + duration);
  filter.Q.value = 2;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.3, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  noise.start(now);
  noise.stop(now + duration);
}

// Shuriken target hit — metallic dual-oscillator ping with fast decay
export function playShurikenHit() {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.2;

  const osc1 = ctx.createOscillator();
  osc1.type = "sine";
  osc1.frequency.setValueAtTime(2400, now);
  osc1.frequency.exponentialRampToValueAtTime(1800, now + duration);

  const osc2 = ctx.createOscillator();
  osc2.type = "triangle";
  osc2.frequency.setValueAtTime(3200, now);
  osc2.frequency.exponentialRampToValueAtTime(2200, now + duration);

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.25, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc1.connect(gain);
  osc2.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
}

// Smoke bomb — low sine thump + filtered noise burst
export function playSmokeBomb() {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.3;

  // Low frequency thump
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(120, now);
  osc.frequency.exponentialRampToValueAtTime(40, now + duration);

  const oscGain = ctx.createGain();
  oscGain.gain.setValueAtTime(0.2, now);
  oscGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(oscGain);
  oscGain.connect(ctx.destination);

  // Noise burst for "smoke"
  const bufferSize = Math.floor(ctx.sampleRate * duration);
  const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
  const data = buffer.getChannelData(0);
  for (let i = 0; i < bufferSize; i++) {
    data[i] = (Math.random() * 2 - 1) * (1 - i / bufferSize);
  }

  const noise = ctx.createBufferSource();
  noise.buffer = buffer;

  const noiseFilter = ctx.createBiquadFilter();
  noiseFilter.type = "lowpass";
  noiseFilter.frequency.setValueAtTime(800, now);
  noiseFilter.frequency.exponentialRampToValueAtTime(200, now + duration);

  const noiseGain = ctx.createGain();
  noiseGain.gain.setValueAtTime(0.1, now);
  noiseGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  noise.connect(noiseFilter);
  noiseFilter.connect(noiseGain);
  noiseGain.connect(ctx.destination);

  osc.start(now);
  noise.start(now);
  osc.stop(now + duration);
  noise.stop(now + duration);
}

// Blade clash — metallic sword collision for the Research Lab portal
export function playBladeClash() {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.3;

  const osc1 = ctx.createOscillator();
  osc1.type = "square";
  osc1.frequency.setValueAtTime(1800, now);
  osc1.frequency.exponentialRampToValueAtTime(900, now + duration);

  const osc2 = ctx.createOscillator();
  osc2.type = "sawtooth";
  osc2.frequency.setValueAtTime(2400, now);
  osc2.frequency.exponentialRampToValueAtTime(1100, now + duration);

  const filter = ctx.createBiquadFilter();
  filter.type = "bandpass";
  filter.frequency.setValueAtTime(3500, now);
  filter.frequency.exponentialRampToValueAtTime(1200, now + duration);
  filter.Q.value = 3;

  const gain = ctx.createGain();
  gain.gain.setValueAtTime(0.18, now);
  gain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc1.connect(filter);
  osc2.connect(filter);
  filter.connect(gain);
  gain.connect(ctx.destination);

  osc1.start(now);
  osc2.start(now);
  osc1.stop(now + duration);
  osc2.stop(now + duration);
}

// Data stream hum — low electronic hum with digital blip for terminal typing
export function playDataHum() {
  if (muted) return;
  const ctx = getCtx();
  if (!ctx) return;

  const now = ctx.currentTime;
  const duration = 0.6;

  // Low frequency hum
  const osc = ctx.createOscillator();
  osc.type = "sine";
  osc.frequency.setValueAtTime(90, now);
  osc.frequency.linearRampToValueAtTime(110, now + duration);

  // Subtle vibrato
  const lfo = ctx.createOscillator();
  lfo.type = "sine";
  lfo.frequency.setValueAtTime(5, now);
  const lfoGain = ctx.createGain();
  lfoGain.gain.setValueAtTime(4, now);
  lfo.connect(lfoGain);
  lfoGain.connect(osc.frequency);

  const mainGain = ctx.createGain();
  mainGain.gain.setValueAtTime(0.03, now);
  mainGain.gain.exponentialRampToValueAtTime(0.001, now + duration);

  osc.connect(mainGain);
  mainGain.connect(ctx.destination);

  // Digital blip
  const blip = ctx.createOscillator();
  blip.type = "square";
  blip.frequency.setValueAtTime(1600, now);
  blip.frequency.exponentialRampToValueAtTime(800, now + 0.1);

  const blipFilter = ctx.createBiquadFilter();
  blipFilter.type = "bandpass";
  blipFilter.frequency.value = 1200;
  blipFilter.Q.value = 8;

  const blipGain = ctx.createGain();
  blipGain.gain.setValueAtTime(0.015, now);
  blipGain.gain.exponentialRampToValueAtTime(0.001, now + 0.1);

  blip.connect(blipFilter);
  blipFilter.connect(blipGain);
  blipGain.connect(ctx.destination);

  osc.start(now);
  lfo.start(now);
  blip.start(now);
  osc.stop(now + duration);
  lfo.stop(now + duration);
  blip.stop(now + 0.1);
}