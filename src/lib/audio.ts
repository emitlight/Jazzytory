/**
 * Jazzytory — 오디오 엔진 (Web Audio)
 * ---------------------------------------------------------------------------
 * 샘플 파일 없이 합성만으로 연습 반주를 만든다.
 *
 * 타이밍 원칙: setTimeout 으로 음을 재생하지 않는다.
 * 25ms 주기 타이머가 100ms 앞을 내다보며 AudioContext.currentTime 기준으로 예약한다.
 * 브라우저 타이머는 흔들리지만 오디오 클럭은 흔들리지 않는다.
 */

const LOOKAHEAD_MS = 25;
const SCHEDULE_AHEAD = 0.12;

let ctx: AudioContext | null = null;
let master: GainNode | null = null;
let comp: DynamicsCompressorNode | null = null;

/** 사용자 제스처 이후에만 호출할 것 (자동재생 정책) */
export function ensureAudio(): AudioContext {
  if (!ctx) {
    const Ctor: typeof AudioContext =
      window.AudioContext ?? (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    ctx = new Ctor();
    comp = ctx.createDynamicsCompressor();
    comp.threshold.value = -12;
    comp.ratio.value = 6;
    comp.attack.value = 0.004;
    comp.release.value = 0.2;
    master = ctx.createGain();
    master.gain.value = 0.85;
    comp.connect(master);
    master.connect(ctx.destination);
  }
  if (ctx.state === 'suspended') void ctx.resume();
  return ctx;
}

export function audioReady(): boolean { return ctx !== null && ctx.state === 'running'; }
export function setMasterVolume(v: number) { if (master) master.gain.value = Math.max(0, Math.min(1, v)); }
export function getMasterVolume(): number { return master?.gain.value ?? 0.85; }

function bus(): AudioNode { ensureAudio(); return comp!; }

/* ───────────────────────── 음색 (합성) ───────────────────────── */

export type Instrument = 'piano' | 'bass' | 'ride' | 'hihat' | 'kick' | 'snare' | 'click' | 'clickAccent';

/**
 * 피아노: 기본파 + 배음. 음이 높을수록 밝고 짧게.
 * 실제 피아노의 비조화 배음까지 흉내내지는 않지만, 음정 학습에는 충분하다.
 */
function playPiano(freq: number, time: number, dur: number, velocity: number) {
  const c = ensureAudio();
  const out = c.createGain();
  out.gain.value = 0;
  out.connect(bus());

  const bright = Math.min(1, Math.max(0.25, (freq - 110) / 900));
  const partials: [number, number][] = [[1, 1], [2, 0.35 * bright], [3, 0.14 * bright], [4, 0.06 * bright]];

  for (const [mult, amp] of partials) {
    const osc = c.createOscillator();
    osc.type = mult === 1 ? 'triangle' : 'sine';
    osc.frequency.value = freq * mult;
    const g = c.createGain();
    g.gain.value = amp;
    osc.connect(g); g.connect(out);
    osc.start(time);
    osc.stop(time + dur + 0.35);
    osc.onended = () => { try { osc.disconnect(); g.disconnect(); } catch { /* 이미 해제됨 */ } };
  }

  const peak = 0.16 * velocity;
  const decayTo = peak * 0.22;
  out.gain.setValueAtTime(0.0001, time);
  out.gain.exponentialRampToValueAtTime(Math.max(peak, 0.0002), time + 0.004);
  out.gain.exponentialRampToValueAtTime(Math.max(decayTo, 0.0002), time + 0.35);
  out.gain.exponentialRampToValueAtTime(0.0001, time + dur + 0.3);
  setTimeout(() => { try { out.disconnect(); } catch { /* noop */ } }, (time - c.currentTime + dur + 0.8) * 1000);
}

/** 더블베이스: 삼각파 + 저역통과 + 짧은 픽업 노이즈 */
function playBass(freq: number, time: number, dur: number, velocity: number) {
  const c = ensureAudio();
  const out = c.createGain();
  out.connect(bus());
  const lp = c.createBiquadFilter();
  lp.type = 'lowpass';
  lp.frequency.setValueAtTime(1400, time);
  lp.frequency.exponentialRampToValueAtTime(380, time + 0.18);
  lp.Q.value = 1.2;
  lp.connect(out);

  const osc = c.createOscillator();
  osc.type = 'triangle';
  osc.frequency.value = freq;
  const og = c.createGain();
  og.gain.value = 0.9;
  osc.connect(og); og.connect(lp);

  const sub = c.createOscillator();
  sub.type = 'sine';
  sub.frequency.value = freq;
  const sg = c.createGain();
  sg.gain.value = 0.5;
  sub.connect(sg); sg.connect(lp);

  const peak = 0.3 * velocity;
  out.gain.setValueAtTime(0.0001, time);
  out.gain.exponentialRampToValueAtTime(peak, time + 0.012);
  out.gain.exponentialRampToValueAtTime(peak * 0.35, time + dur * 0.7);
  out.gain.exponentialRampToValueAtTime(0.0001, time + dur + 0.08);

  for (const o of [osc, sub]) {
    o.start(time);
    o.stop(time + dur + 0.12);
  }
  osc.onended = () => { try { osc.disconnect(); og.disconnect(); sub.disconnect(); sg.disconnect(); lp.disconnect(); out.disconnect(); } catch { /* noop */ } };
}

let noiseBuffer: AudioBuffer | null = null;
function getNoise(c: AudioContext): AudioBuffer {
  if (!noiseBuffer) {
    noiseBuffer = c.createBuffer(1, c.sampleRate * 2, c.sampleRate);
    const d = noiseBuffer.getChannelData(0);
    for (let i = 0; i < d.length; i++) d[i] = Math.random() * 2 - 1;
  }
  return noiseBuffer;
}

function playNoiseHit(time: number, opts: { freq: number; q: number; dur: number; gain: number; type?: BiquadFilterType }) {
  const c = ensureAudio();
  const src = c.createBufferSource();
  src.buffer = getNoise(c);
  src.loop = true;
  const f = c.createBiquadFilter();
  f.type = opts.type ?? 'bandpass';
  f.frequency.value = opts.freq;
  f.Q.value = opts.q;
  const g = c.createGain();
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(opts.gain, time + 0.003);
  g.gain.exponentialRampToValueAtTime(0.0001, time + opts.dur);
  src.connect(f); f.connect(g); g.connect(bus());
  src.start(time);
  src.stop(time + opts.dur + 0.05);
  src.onended = () => { try { src.disconnect(); f.disconnect(); g.disconnect(); } catch { /* noop */ } };
}

function playKick(time: number, velocity: number) {
  const c = ensureAudio();
  const osc = c.createOscillator();
  const g = c.createGain();
  osc.type = 'sine';
  osc.frequency.setValueAtTime(120, time);
  osc.frequency.exponentialRampToValueAtTime(42, time + 0.09);
  g.gain.setValueAtTime(0.0001, time);
  g.gain.exponentialRampToValueAtTime(0.45 * velocity, time + 0.005);
  g.gain.exponentialRampToValueAtTime(0.0001, time + 0.28);
  osc.connect(g); g.connect(bus());
  osc.start(time); osc.stop(time + 0.32);
  osc.onended = () => { try { osc.disconnect(); g.disconnect(); } catch { /* noop */ } };
}

export function playNote(inst: Instrument, freq: number, time: number, dur: number, velocity = 1) {
  switch (inst) {
    case 'piano': playPiano(freq, time, dur, velocity); break;
    case 'bass': playBass(freq, time, dur, velocity); break;
    case 'ride': playNoiseHit(time, { freq: 6200, q: 0.7, dur: 0.55, gain: 0.055 * velocity, type: 'highpass' }); break;
    case 'hihat': playNoiseHit(time, { freq: 9000, q: 1.4, dur: 0.09, gain: 0.075 * velocity, type: 'highpass' }); break;
    case 'snare': playNoiseHit(time, { freq: 2000, q: 0.9, dur: 0.16, gain: 0.12 * velocity }); break;
    case 'kick': playKick(time, velocity); break;
    case 'click': playNoiseHit(time, { freq: 1500, q: 6, dur: 0.04, gain: 0.25 * velocity }); break;
    case 'clickAccent': playNoiseHit(time, { freq: 2600, q: 6, dur: 0.05, gain: 0.38 * velocity }); break;
  }
}

/** 즉시 한 음 (건반 클릭용) */
export function strike(freq: number, dur = 1.1, inst: Instrument = 'piano', velocity = 1) {
  const c = ensureAudio();
  playNote(inst, freq, c.currentTime + 0.01, dur, velocity);
}

/** 화음 — 약간의 아르페지오 지연을 줘 사람 손처럼 */
export function strikeChord(freqs: number[], dur = 1.6, spreadMs = 6) {
  const c = ensureAudio();
  freqs.forEach((f, i) => playNote('piano', f, c.currentTime + 0.01 + (i * spreadMs) / 1000, dur, 0.9));
}

/* ───────────────────────── 스케줄러 ───────────────────────── */

/** 한 박에서 8분음표 뒷박이 놓이는 위치 (0.5=균등, 0.667=완전 삼연음) */
export function swingRatio(bpm: number, amount = 1): number {
  const base = bpm <= 100 ? 0.66 : bpm >= 220 ? 0.55 : 0.66 - ((bpm - 100) / 120) * 0.11;
  return 0.5 + (base - 0.5) * amount;
}

export interface ScheduledEvent {
  /** 마디 시작부터의 박 단위 위치 */
  beat: number;
  inst: Instrument;
  freq: number;
  /** 박 단위 길이 */
  duration: number;
  velocity: number;
}

export interface TransportOptions {
  bpm: number;
  beatsPerBar: number;
  /** 마디 번호(0부터)를 받아 그 마디의 이벤트를 돌려준다 */
  getBar: (barIndex: number) => ScheduledEvent[];
  /** 총 마디 수. 끝나면 정지 */
  totalBars?: number;
  onBeat?: (barIndex: number, beat: number) => void;
  onBar?: (barIndex: number) => void;
  onEnd?: () => void;
}

export class Transport {
  private timer: number | null = null;
  private nextBarTime = 0;
  private barIndex = 0;
  private opts: TransportOptions;
  private running = false;

  constructor(opts: TransportOptions) { this.opts = opts; }

  get isRunning() { return this.running; }
  get currentBar() { return this.barIndex; }

  setBpm(bpm: number) { this.opts.bpm = bpm; }

  start(fromBar = 0) {
    const c = ensureAudio();
    this.barIndex = fromBar;
    this.nextBarTime = c.currentTime + 0.12;
    this.running = true;
    this.tick();
    this.timer = window.setInterval(() => this.tick(), LOOKAHEAD_MS);
  }

  stop() {
    this.running = false;
    if (this.timer !== null) { window.clearInterval(this.timer); this.timer = null; }
  }

  private tick() {
    if (!this.running || !ctx) return;
    const secPerBeat = 60 / this.opts.bpm;
    const barDur = secPerBeat * this.opts.beatsPerBar;

    while (this.nextBarTime < ctx.currentTime + SCHEDULE_AHEAD) {
      if (this.opts.totalBars !== undefined && this.barIndex >= this.opts.totalBars) {
        this.stop();
        this.opts.onEnd?.();
        return;
      }
      const events = this.opts.getBar(this.barIndex);
      const barStart = this.nextBarTime;
      for (const e of events) {
        playNote(e.inst, e.freq, barStart + e.beat * secPerBeat, e.duration * secPerBeat, e.velocity);
      }
      const idx = this.barIndex;
      const delayMs = Math.max(0, (barStart - ctx.currentTime) * 1000);
      window.setTimeout(() => { if (this.running) this.opts.onBar?.(idx); }, delayMs);
      for (let b = 0; b < this.opts.beatsPerBar; b++) {
        const d = Math.max(0, (barStart + b * secPerBeat - ctx.currentTime) * 1000);
        window.setTimeout(() => { if (this.running) this.opts.onBeat?.(idx, b); }, d);
      }
      this.nextBarTime += barDur;
      this.barIndex += 1;
    }
  }
}
