/**
 * Jazzytory — 플레이어롱 생성기 (Walking Bass · Comping · Drums)
 * ---------------------------------------------------------------------------
 * 코드 진행만 주면 연습용 리듬 섹션을 만들어 준다.
 *
 * 설계에서 가장 중요한 결정: **컴핑은 쉬어야 한다.**
 * 모든 마디를 채우는 반주는 학습자의 연주를 덮어버리고, 자기 소리를 못 듣게 만든다.
 */

import { parseChord, type Chord, type Note, toMidi, toFrequency, midiToNote, degreeFrom } from './theory';
import { makeVoicing } from './voicing';
import type { ScheduledEvent } from './audio';
import { swingRatio } from './audio';
import type { Bar, TuneSection } from '../data/types';

export interface FlatBar {
  chords: string[];
  beats: number[];
  sectionLabel?: string;
  /** 원본 섹션 안에서의 마디 번호 (1부터) */
  barInSection: number;
  absoluteBar: number;
}

/** 섹션 구조를 연속된 마디 배열로 편다. 빈 코드 마디는 직전 코드를 잇는다. */
export function flattenChart(sections: TuneSection[], beatsPerBar = 4): FlatBar[] {
  const out: FlatBar[] = [];
  let last: string[] = ['C∆7'];
  let abs = 0;
  for (const sec of sections) {
    sec.bars.forEach((bar: Bar, i) => {
      const chords = bar.chords.length ? bar.chords : last;
      last = chords;
      const beats = bar.beats && bar.beats.length === chords.length
        ? bar.beats
        : splitEvenly(beatsPerBar, chords.length);
      out.push({
        chords, beats,
        sectionLabel: i === 0 ? sec.label : bar.section,
        barInSection: i + 1,
        absoluteBar: abs++,
      });
    });
  }
  return out;
}

function splitEvenly(total: number, parts: number): number[] {
  if (parts <= 1) return [total];
  const base = Math.floor(total / parts);
  const rem = total - base * parts;
  return Array.from({ length: parts }, (_, i) => base + (i < rem ? 1 : 0));
}

/** 마디의 각 박에 해당하는 코드 */
export function chordAtBeat(bar: FlatBar, beat: number): string {
  let acc = 0;
  for (let i = 0; i < bar.chords.length; i++) {
    acc += bar.beats[i];
    if (beat < acc) return bar.chords[i];
  }
  return bar.chords[bar.chords.length - 1];
}

/* ─────────────────────────  워킹 베이스  ───────────────────────── */

const BASS_LO = 28; // E1
const BASS_HI = 55; // G3

function nearest(pcNote: Note, aroundMidi: number): number {
  let m = toMidi(pcNote);
  while (m < aroundMidi - 6) m += 12;
  while (m > aroundMidi + 6) m -= 12;
  return Math.max(BASS_LO, Math.min(BASS_HI, m));
}

function chordToneMidis(chord: Chord, aroundMidi: number): number[] {
  return chord.degrees
    .filter((d) => d.role !== 'tension')
    .map((d) => nearest(degreeFrom(chord.root, d.degree, d.alter), aroundMidi));
}

/**
 * 한 마디의 워킹 베이스 라인.
 * 강박(1박)은 코드톤, 4박은 다음 코드 루트로 향하는 접근음.
 * 같은 음이 세 번 연속되지 않게 하고, 음역을 지킨다.
 */
export function walkBar(
  bar: FlatBar,
  nextRootMidi: number | null,
  prevMidi: number,
  beatsPerBar = 4,
): number[] {
  const line: number[] = [];
  const first = parseChord(bar.chords[0]);
  if (!first) return Array.from({ length: beatsPerBar }, () => prevMidi);

  // 1박: 루트 (2코드 마디가 아니면 가끔 5음/3음으로 변화)
  const rootM = nearest(first.root, prevMidi);
  const twoChords = bar.chords.length > 1;
  let cur = rootM;
  if (!twoChords && Math.random() < 0.22) {
    const tones = chordToneMidis(first, prevMidi).filter((m) => m !== rootM);
    if (tones.length) cur = tones[Math.floor(Math.random() * tones.length)];
  }
  line.push(cur);

  for (let b = 1; b < beatsPerBar; b++) {
    const symbol = chordAtBeat(bar, b);
    const chord = parseChord(symbol) ?? first;
    const isLast = b === beatsPerBar - 1;

    if (isLast && nextRootMidi !== null) {
      // 마지막 박은 다음 루트로의 접근음: 반음 아래 > 반음 위 > 5도 위
      const target = nearest(midiToNote(nextRootMidi), cur);
      const candidates = [target - 1, target + 1, target + 7, target - 7]
        .filter((m) => m >= BASS_LO && m <= BASS_HI)
        .sort((a, b2) => Math.abs(a - cur) - Math.abs(b2 - cur));
      cur = candidates[0] ?? cur;
    } else {
      const tones = chordToneMidis(chord, cur);
      const direction = cur > (BASS_LO + BASS_HI) / 2 ? -1 : 1;
      const opts = tones
        .filter((m) => m !== cur && m !== line[line.length - 2])
        .sort((a, b2) => Math.abs(a - cur) - Math.abs(b2 - cur));
      // 가끔 반음 경과음
      if (opts.length && Math.random() < 0.25) cur = opts[0] + direction * 0 + (Math.random() < 0.5 ? -1 : 1);
      else cur = opts[0] ?? cur + direction * 2;
      cur = Math.max(BASS_LO, Math.min(BASS_HI, cur));
    }
    line.push(cur);
  }
  return line;
}

/* ─────────────────────────  컴핑 리듬  ───────────────────────── */

/** [박 위치, 길이(박)] — 박 위치는 0-based, 0.5 는 뒷박(스윙 적용됨) */
const COMP_PATTERNS: [number, number][][] = [
  [[0, 0.75], [1.5, 1.0]],            // 찰스턴
  [[1.5, 1.0], [3.0, 0.75]],
  [[0.5, 0.75], [2.0, 1.0]],
  [[3.5, 1.25]],                      // 다음 마디로 넘어가는 앤티시페이션
  [[1.0, 0.75], [2.5, 1.0]],
  [],                                 // 쉼 — 반드시 필요하다
  [],
  [[0, 1.5]],
];

/* ─────────────────────────  전체 조립  ───────────────────────── */

export interface PlayalongOptions {
  bpm: number;
  beatsPerBar?: number;
  bass: boolean;
  piano: boolean;
  drums: boolean;
  /** 메트로놈 클릭 (2·4박) */
  click: boolean;
  swing: number;         // 0~1
  /** 이조 반음 */
  transpose?: number;
  /** 컴핑 밀도 0~1 — 낮을수록 많이 쉰다 */
  compDensity?: number;
  volume?: { bass: number; piano: number; drums: number };
}

export interface PlayalongEngine {
  bars: FlatBar[];
  getBar: (index: number) => ScheduledEvent[];
  totalBars: number;
}

export function buildPlayalong(bars: FlatBar[], opts: PlayalongOptions): PlayalongEngine {
  const beatsPerBar = opts.beatsPerBar ?? 4;
  const sr = swingRatio(opts.bpm, opts.swing);
  const density = opts.compDensity ?? 0.6;
  const vol = opts.volume ?? { bass: 1, piano: 1, drums: 1 };
  const tr = opts.transpose ?? 0;

  // 베이스는 마디를 넘어 이어져야 하므로 전체를 미리 계산한다
  const bassLines: number[][] = [];
  let prev = 40;
  for (let i = 0; i < bars.length; i++) {
    const nextBar = bars[(i + 1) % bars.length];
    const nextChord = parseChord(nextBar.chords[0]);
    const nextRoot = nextChord ? toMidi(nextChord.root) + tr : null;
    const line = walkBar(
      { ...bars[i], chords: bars[i].chords },
      nextRoot === null ? null : ((nextRoot - 28) % 12) + 28,
      prev,
      beatsPerBar,
    ).map((m) => m + tr);
    bassLines.push(line);
    prev = line[line.length - 1];
  }

  const getBar = (rawIndex: number): ScheduledEvent[] => {
    const index = ((rawIndex % bars.length) + bars.length) % bars.length;
    const bar = bars[index];
    const events: ScheduledEvent[] = [];

    /* 베이스 */
    if (opts.bass) {
      bassLines[index].forEach((m, b) => {
        events.push({
          beat: b, inst: 'bass',
          freq: toFrequency(midiToNote(Math.max(BASS_LO, Math.min(BASS_HI, m)))),
          duration: 0.92,
          velocity: (b === 0 ? 1 : 0.85) * vol.bass,
        });
      });
    }

    /* 드럼 — 재즈 라이드 패턴 + 2·4박 하이햇 */
    if (opts.drums) {
      for (let b = 0; b < beatsPerBar; b++) {
        events.push({ beat: b, inst: 'ride', freq: 0, duration: 0.5, velocity: (b % 2 === 0 ? 0.9 : 0.7) * vol.drums });
        // 2박·4박 뒤에 스윙된 8분음표 (재즈 라이드의 "칙-치키-칙")
        if (b % 2 === 1) {
          events.push({ beat: b + sr, inst: 'ride', freq: 0, duration: 0.4, velocity: 0.62 * vol.drums });
          events.push({ beat: b, inst: 'hihat', freq: 0, duration: 0.1, velocity: 0.85 * vol.drums });
        }
      }
      // 드문 킥 폭탄
      if (Math.random() < 0.18) {
        events.push({ beat: 1 + sr, inst: 'kick', freq: 0, duration: 0.2, velocity: 0.5 * vol.drums });
      }
      if (Math.random() < 0.1) {
        events.push({ beat: 2 + sr, inst: 'snare', freq: 0, duration: 0.15, velocity: 0.4 * vol.drums });
      }
    }

    /* 메트로놈 */
    if (opts.click) {
      for (let b = 0; b < beatsPerBar; b++) {
        if (b % 2 === 1) events.push({ beat: b, inst: 'clickAccent', freq: 0, duration: 0.1, velocity: 0.8 });
      }
    }

    /* 피아노 컴핑 */
    if (opts.piano) {
      const patternIdx = Math.floor(Math.random() * COMP_PATTERNS.length);
      const shouldPlay = Math.random() < density;
      const pattern = shouldPlay ? COMP_PATTERNS[patternIdx] : [];
      for (const [pos, len] of pattern) {
        const beatInt = Math.floor(pos);
        const off = pos - beatInt;
        const actual = beatInt + (off === 0.5 ? sr : off);
        if (actual >= beatsPerBar) continue;
        const symbol = chordAtBeat(bar, Math.min(beatsPerBar - 1, Math.floor(actual)));
        const chord = parseChord(symbol);
        if (!chord) continue;
        const style = index % 2 === 0 ? 'rootless-a' : 'rootless-b';
        const v = makeVoicing(chord, style, { targetBottom: 52 });
        v.notes.forEach((n, i) => {
          events.push({
            beat: actual + i * 0.006,
            inst: 'piano',
            freq: toFrequency({ ...n.note, octave: n.note.octave }) * Math.pow(2, tr / 12),
            duration: len,
            velocity: 0.55 * vol.piano,
          });
        });
      }
    }

    return events;
  };

  return { bars, getBar, totalBars: bars.length };
}

/** 단일 진행(랩용)을 마디 배열로 */
export function progressionToBars(symbols: string[], chordsPerBar = 1): FlatBar[] {
  const out: FlatBar[] = [];
  for (let i = 0; i < symbols.length; i += chordsPerBar) {
    const chords = symbols.slice(i, i + chordsPerBar);
    out.push({
      chords,
      beats: splitEvenly(4, chords.length),
      barInSection: out.length + 1,
      absoluteBar: out.length,
    });
  }
  return out;
}
