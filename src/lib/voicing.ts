/**
 * Jazzytory — 보이싱 엔진 (Voicing Engine)
 * ---------------------------------------------------------------------------
 * 학습자가 "무슨 음을 누를지"를 실제 건반 위 음으로 돌려준다.
 * 음역 제약과 성부 진행 최소화가 이 파일의 존재 이유다.
 * 이론적으로 맞지만 손에 안 맞는 보이싱은 틀린 보이싱이다.
 */

import {
  type Chord, type Note, degreeFrom, toMidi, midiToNote, noteName, parseChord,
} from './theory';
import type { VoicingStyleId } from '../data/types';

export interface VoicedNote {
  note: Note;
  /** "R", "3", "b7", "9", "#11" 등 */
  role: string;
  hand: 'L' | 'R';
}

export interface Voicing {
  style: VoicingStyleId;
  chordSymbol: string;
  notes: VoicedNote[];
  label: string;
  labelKo: string;
  description: string;
  /** 이 보이싱이 적합하지 않을 때의 경고 */
  warning?: string;
}

export const VOICING_META: Record<VoicingStyleId, { label: string; labelKo: string; level: string; description: string }> = {
  'shell-a':        { label: 'Shell A (1-3-7)',   labelKo: '셸 A (1-3-7)',       level: 'L1', description: '근음 + 3음 + 7음. 세 음뿐인데 코드의 성격이 다 들어간다. 재즈의 첫 보이싱.' },
  'shell-b':        { label: 'Shell B (1-7-3)',   labelKo: '셸 B (1-7-3)',       level: 'L1', description: '7음을 3음보다 아래에 둔다. 진행에서 셸 A 와 번갈아 쓰면 손이 거의 움직이지 않는다.' },
  'guide-tones':    { label: 'Guide Tones (3-7)', labelKo: '가이드 톤 (3-7)',    level: 'L2', description: '3음과 7음만. 베이시스트가 있으면 이것만으로 충분하다. 모든 성부 진행의 뼈대.' },
  'rootless-a':     { label: 'Rootless A',        labelKo: '루트리스 A',         level: 'L2', description: '3음을 맨 아래에 둔 4성부(3-5-7-9). 도미넌트에서는 5음 대신 13음을 쓴다.' },
  'rootless-b':     { label: 'Rootless B',        labelKo: '루트리스 B',         level: 'L2', description: '7음을 맨 아래에 둔 4성부(7-9-3-5). A형과 번갈아 쓰는 것이 핵심이다.' },
  'drop2':          { label: 'Drop 2',            labelKo: '드롭 2',             level: 'L5', description: '밀집 4성부에서 위에서 두 번째 음을 한 옥타브 내린다. 양손 분배가 쉬워진다.' },
  'quartal':        { label: 'Quartal (So What)', labelKo: '쿼탈 (So What)',     level: 'L6', description: '완전4도 세 개 + 장3도. 3도 화음의 중력을 지운 모달의 소리.' },
  'upper-structure':{ label: 'Upper Structure',   labelKo: '어퍼 스트럭처',      level: 'L5', description: '왼손 가이드 톤 + 오른손 트라이어드. 텐션을 트라이어드로 묶어서 손에 쥔다.' },
  'block':          { label: 'Block (4-way)',     labelKo: '블록 코드',          level: 'L7', description: '멜로디 아래 밀집 4성부. 조지 시어링·레드 갈랜드의 소리.' },
  'spread':         { label: 'Spread',            labelKo: '스프레드',           level: 'L7', description: '근음을 낮게 두고 위를 넓게 벌린다. 솔로 피아노의 발라드 인트로.' },
};

/* ───────────── 유틸 ───────────── */

const C3 = 48, C4 = 60, C6 = 84, E2 = 40;

function degreeLabel(degree: number, alter: number): string {
  const acc = alter > 0 ? '#'.repeat(alter) : alter < 0 ? 'b'.repeat(-alter) : '';
  if (degree === 1) return 'R';
  return acc + degree;
}

/** 음을 특정 MIDI 범위 안으로 옥타브 이동 */
function placeInRange(n: Note, lo: number, hi: number): Note {
  let m = toMidi(n);
  while (m < lo) m += 12;
  while (m > hi) m -= 12;
  return { ...n, octave: n.octave + Math.round((m - toMidi(n)) / 12) };
}

/**
 * 아래 음 **바로 위**(한 옥타브 이내)에 앉힌다.
 * 위로 올리기만 하면 근음의 옥타브에 끌려 보이싱이 2옥타브씩 벌어진다 —
 * 이론적으로는 같은 화음이지만 손에 안 맞으므로 틀린 보이싱이다.
 */
function stackAbove(n: Note, belowMidi: number): Note {
  let out = { ...n };
  while (toMidi(out) <= belowMidi) out = { ...out, octave: out.octave + 1 };
  while (toMidi(out) - 12 > belowMidi) out = { ...out, octave: out.octave - 1 };
  return out;
}

interface DegPick { degree: number; alter: number }

/** 근음 대비 반음 위치 (블록 코드의 중복 제거용) */
function degreeSemitoneOf(_chord: Chord, p: DegPick): number {
  const base = [0, 2, 4, 5, 7, 9, 11];
  const idx = (p.degree - 1) % 7;
  return base[idx] + p.alter;
}

/** 코드에서 특정 도수를 찾는다. 없으면 기본 변화값으로 만든다. */
function pick(chord: Chord, degree: number, fallbackAlter = 0): DegPick {
  const found = chord.degrees.find((d) => d.degree === degree);
  if (found) return { degree, alter: found.alter };
  // 7음이 없으면 6음으로 대체
  if (degree === 7) {
    const sixth = chord.degrees.find((d) => d.degree === 6);
    if (sixth) return { degree: 6, alter: sixth.alter };
  }
  // 3음이 없으면 sus 음
  if (degree === 3) {
    const sus = chord.degrees.find((d) => d.role === 'sus');
    if (sus) return { degree: sus.degree, alter: sus.alter };
  }
  return { degree, alter: fallbackAlter };
}

const isDominantChord = (c: Chord) =>
  c.quality === 'dom7' || c.quality === 'altered' || c.quality === 'dom7sharp5' || c.quality === 'dom7sus4';

/** 코드 성질별 기본 9음 (얼터드면 b9) */
function ninth(chord: Chord): DegPick {
  const explicit = chord.degrees.find((d) => d.degree === 9);
  if (explicit) return { degree: 9, alter: explicit.alter };
  if (chord.quality === 'altered') return { degree: 9, alter: -1 };
  if (chord.quality === 'halfDim7') return { degree: 9, alter: 0 };
  return { degree: 9, alter: 0 };
}

/** 도미넌트의 5음 자리에 들어가는 음 (보통 13, 얼터드면 b13) */
function thirteenth(chord: Chord): DegPick {
  const explicit = chord.degrees.find((d) => d.degree === 13);
  if (explicit) return { degree: 13, alter: explicit.alter };
  if (chord.quality === 'altered' || chord.quality === 'dom7sharp5') return { degree: 13, alter: -1 };
  return { degree: 13, alter: 0 };
}

function build(chord: Chord, picks: DegPick[], hands: ('L' | 'R')[], bottomMidi: number): VoicedNote[] {
  const out: VoicedNote[] = [];
  let prev = bottomMidi - 1;
  picks.forEach((p, i) => {
    const raw = degreeFrom(chord.root, p.degree, p.alter);
    // 첫 음은 목표 음역에 직접 앉히고, 나머지만 그 위로 쌓는다.
    // 이렇게 하지 않으면 근음 옥타브에 끌려 보이싱 전체가 위로 표류한다.
    const placed = i === 0 ? placeInRange(raw, bottomMidi, bottomMidi + 11) : stackAbove(raw, prev);
    prev = toMidi(placed);
    out.push({ note: placed, role: degreeLabel(p.degree, p.alter), hand: hands[i] ?? 'R' });
  });
  return out;
}

/* ───────────── 보이싱 생성 ───────────── */

export interface VoicingOptions {
  /** 왼손 최저음의 목표 MIDI (성부 진행 최소화용) */
  targetBottom?: number;
  /** 블록 코드용 멜로디 음 */
  melody?: Note;
}

export function makeVoicing(chord: Chord, style: VoicingStyleId, opts: VoicingOptions = {}): Voicing {
  const meta = VOICING_META[style];
  const dom = isDominantChord(chord);
  const third = pick(chord, 3);
  const fifth = pick(chord, 5);
  const seventh = pick(chord, 7, -1);
  const nine = ninth(chord);
  const thirteen = thirteenth(chord);
  let notes: VoicedNote[] = [];
  let warning: string | undefined;

  switch (style) {
    case 'shell-a': {
      const rootLow = placeInRange(degreeFrom(chord.root, 1, 0), E2, C3 + 4);
      notes = [{ note: rootLow, role: 'R', hand: 'L' },
        ...build(chord, [third, seventh], ['L', 'L'], toMidi(rootLow) + 1)];
      break;
    }
    case 'shell-b': {
      const rootLow = placeInRange(degreeFrom(chord.root, 1, 0), E2, C3 + 4);
      notes = [{ note: rootLow, role: 'R', hand: 'L' },
        ...build(chord, [seventh, third], ['L', 'L'], toMidi(rootLow) + 1)];
      break;
    }
    case 'guide-tones': {
      const bottom = opts.targetBottom ?? C3 + 5;
      notes = build(chord, [third, seventh], ['L', 'L'], bottom);
      // 3음과 7음의 순서는 더 가까운 쪽으로
      break;
    }
    case 'rootless-a': {
      const bottom = opts.targetBottom ?? C3;
      const upper = dom ? thirteen : fifth;
      notes = build(chord, [third, upper, seventh, nine], ['L', 'L', 'L', 'L'], bottom);
      if (chord.quality === 'dim7') warning = '°7 은 루트리스 A/B 체계에 맞지 않는다. 드롭2 또는 어퍼 스트럭처를 쓰라.';
      break;
    }
    case 'rootless-b': {
      const bottom = opts.targetBottom ?? C3;
      const upper = dom ? thirteen : fifth;
      notes = build(chord, [seventh, nine, third, upper], ['L', 'L', 'L', 'L'], bottom);
      if (chord.quality === 'dim7') warning = '°7 은 루트리스 A/B 체계에 맞지 않는다. 드롭2 또는 어퍼 스트럭처를 쓰라.';
      break;
    }
    case 'drop2': {
      // 밀집 1-3-5-7 에서 위에서 두 번째 음을 한 옥타브 내린다
      const close: DegPick[] = [{ degree: 1, alter: 0 }, third, fifth, seventh];
      const bottom = opts.targetBottom ?? C3 + 2;
      const stacked = build(chord, close, ['L', 'R', 'R', 'R'], bottom);
      const sorted = [...stacked].sort((a, b) => toMidi(a.note) - toMidi(b.note));
      const idx = sorted.length - 2;
      sorted[idx] = { ...sorted[idx], note: { ...sorted[idx].note, octave: sorted[idx].note.octave - 1 }, hand: 'L' };
      notes = sorted.sort((a, b) => toMidi(a.note) - toMidi(b.note));
      break;
    }
    case 'quartal': {
      // So What 보이싱: 완전4도 3개 + 장3도. 마이너/모달에 최적
      const base = chord.quality.startsWith('min') || chord.quality === 'min7' ? pick(chord, 5) : third;
      const bottom = opts.targetBottom ?? C3 + 5;
      const start = placeInRange(degreeFrom(chord.root, base.degree, base.alter), bottom, bottom + 11);
      const stack: VoicedNote[] = [{ note: start, role: degreeLabel(base.degree, base.alter), hand: 'L' }];
      let cur = toMidi(start);
      const intervals = [5, 5, 5, 4];
      for (const iv of intervals) {
        cur += iv;
        stack.push({ note: midiToNote(cur, chord.root.alter < 0), role: '4도', hand: cur > C4 + 4 ? 'R' : 'L' });
      }
      notes = stack;
      if (!(chord.quality.startsWith('min') || chord.quality === 'dom7sus4' || chord.quality === 'min7')) {
        warning = '쿼탈은 마이너·서스·모달 화성에서 가장 자연스럽다. 메이저/도미넌트에서는 구성음을 직접 확인하라.';
      }
      break;
    }
    case 'upper-structure': {
      // 왼손 가이드 톤(3-7) + 오른손 트라이어드
      const lh = build(chord, [third, seventh], ['L', 'L'], opts.targetBottom ?? C3 + 2);
      // 도미넌트: US II(9,#11,13) / US bVI(b13,R,b9) — 여기서는 텐션 기반으로 선택
      let triad: DegPick[];
      if (chord.quality === 'altered') triad = [{ degree: 9, alter: -1 }, { degree: 11, alter: 1 }, { degree: 13, alter: -1 }];
      else if (dom) triad = [{ degree: 9, alter: 0 }, { degree: 11, alter: 1 }, { degree: 13, alter: 0 }];
      else if (chord.quality === 'maj7') triad = [{ degree: 9, alter: 0 }, { degree: 11, alter: 1 }, { degree: 13, alter: 0 }];
      else triad = [{ degree: 9, alter: 0 }, { degree: 11, alter: 0 }, { degree: 13, alter: 0 }];
      const rhBottom = Math.max(toMidi(lh[lh.length - 1].note) + 2, C4);
      const rh = build(chord, triad, ['R', 'R', 'R'], rhBottom);
      notes = [...lh, ...rh];
      break;
    }
    case 'block': {
      // 4-way close: 멜로디 + 그 아래 나머지 코드톤 3개, 왼손이 멜로디를 한 옥타브 아래 더블링.
      // 멜로디와 같은 음을 오른손에서 또 치지 않도록 코드톤에서 멜로디 음을 뺀다.
      const melody = opts.melody ?? degreeFrom(chord.root, 3, third.alter);
      const top = placeInRange(melody, C4 + 5, C6);
      const topPc = ((toMidi(top) % 12) + 12) % 12;
      const candidates: DegPick[] = [{ degree: 1, alter: 0 }, third, fifth, seventh]
        .filter((p) => ((degreeSemitoneOf(chord, p) % 12) + 12) % 12 !== topPc);
      let cur = toMidi(top);
      const stack: VoicedNote[] = [{ note: top, role: '멜로디', hand: 'R' }];
      // 멜로디 바로 아래로 하행하며 밀집 배치
      for (const p of candidates.slice(0, 3)) {
        let n = degreeFrom(chord.root, p.degree, p.alter);
        while (toMidi(n) >= cur) n = { ...n, octave: n.octave - 1 };
        while (cur - toMidi(n) > 12) n = { ...n, octave: n.octave + 1 };
        cur = toMidi(n);
        stack.unshift({ note: n, role: degreeLabel(p.degree, p.alter), hand: 'R' });
      }
      const doubled: VoicedNote = { note: { ...top, octave: top.octave - 1 }, role: '멜로디 8vb', hand: 'L' };
      notes = [doubled, ...stack];
      break;
    }
    case 'spread': {
      const rootLow = placeInRange(degreeFrom(chord.root, 1, 0), E2, C3);
      const rest = build(chord, [seventh, third, dom ? thirteen : fifth, nine], ['L', 'R', 'R', 'R'], toMidi(rootLow) + 10);
      notes = [{ note: rootLow, role: 'R', hand: 'L' }, ...rest];
      break;
    }
  }

  // 음역 정규화 — 위/아래 보정이 서로를 되돌리지 않도록 한 루프에서 처리한다
  const shiftAll = (semitoneOctaves: number) => {
    notes = notes.map((v) => ({ ...v, note: { ...v.note, octave: v.note.octave + semitoneOctaves } }));
  };
  for (let guard = 0; guard < 4; guard++) {
    const lo = Math.min(...notes.map((v) => toMidi(v.note)));
    const hi = Math.max(...notes.map((v) => toMidi(v.note)));
    if (hi > C6 && lo - 12 >= E2) shiftAll(-1);
    else if (lo < E2 && hi + 12 <= C6) shiftAll(1);
    else break;
  }
  {
    const lo = Math.min(...notes.map((v) => toMidi(v.note)));
    const hi = Math.max(...notes.map((v) => toMidi(v.note)));
    if (hi - lo > 40) warning ??= '음역이 4옥타브 가까이 벌어졌다. 양손으로 나누거나 위쪽 텐션을 하나 빼라.';
  }

  // 저역 3도 간격 경고 (C3 아래에서 3도 이하 간격은 탁해진다)
  const sorted = [...notes].sort((a, b) => toMidi(a.note) - toMidi(b.note));
  for (let i = 0; i < sorted.length - 1; i++) {
    const lo = toMidi(sorted[i].note), hi = toMidi(sorted[i + 1].note);
    if (lo < C3 && hi - lo <= 4 && hi - lo > 0) {
      warning ??= '저역에서 3도 이하로 좁다. 이 음역에서는 배음이 뭉쳐 탁하게 들린다 — 아래 음을 한 옥타브 내리거나 빼라.';
      break;
    }
  }

  return {
    style,
    chordSymbol: chord.input,
    notes: sorted,
    label: meta.label,
    labelKo: meta.labelKo,
    description: meta.description,
    warning,
  };
}

/* ───────────── 성부 진행 최소화 ───────────── */

/**
 * 진행 전체에 보이싱을 붙이되, 코드 간 손 이동이 최소가 되도록 옥타브를 고른다.
 * 루트리스 A/B 교대가 자동으로 나오는 이유가 이것이다.
 */
export function voiceProgression(
  symbols: string[],
  style: VoicingStyleId,
  opts: { alternateAB?: boolean } = {},
): Voicing[] {
  const out: Voicing[] = [];
  let prevCenter: number | null = null;

  for (let i = 0; i < symbols.length; i++) {
    const chord = parseChord(symbols[i]);
    if (!chord) continue;

    let useStyle = style;
    if (opts.alternateAB && (style === 'rootless-a' || style === 'rootless-b')) {
      useStyle = i % 2 === 0 ? style : (style === 'rootless-a' ? 'rootless-b' : 'rootless-a');
    }

    // 후보 옥타브들 중 이전 보이싱과 가장 가까운 것
    const candidates: Voicing[] = [];
    for (const shift of [-12, 0, 12]) {
      const base = prevCenter === null ? C3 : Math.round(prevCenter) - 6;
      candidates.push(makeVoicing(chord, useStyle, { targetBottom: base + shift }));
    }
    const scored = candidates.map((v) => {
      const center = v.notes.reduce((s, n) => s + toMidi(n.note), 0) / v.notes.length;
      const distance = prevCenter === null ? Math.abs(center - (C4 - 2)) : Math.abs(center - prevCenter);
      const outOfRange = v.notes.some((n) => toMidi(n.note) < E2 || toMidi(n.note) > C6);
      return { v, score: distance + (outOfRange ? 100 : 0) };
    });
    scored.sort((a, b) => a.score - b.score);
    const chosen = scored[0].v;
    prevCenter = chosen.notes.reduce((s, n) => s + toMidi(n.note), 0) / chosen.notes.length;
    out.push({ ...chosen, chordSymbol: symbols[i] });
  }
  return out;
}

/** 두 보이싱 사이 총 이동 반음 수 — 성부 진행 품질 지표 */
export function voiceLeadingDistance(a: Voicing, b: Voicing): number {
  const am = a.notes.map((n) => toMidi(n.note)).sort((x, y) => x - y);
  const bm = b.notes.map((n) => toMidi(n.note)).sort((x, y) => x - y);
  const len = Math.min(am.length, bm.length);
  let total = 0;
  for (let i = 0; i < len; i++) total += Math.abs(am[i] - bm[i]);
  return total;
}

/** 가이드 톤 라인 — 연속 코드의 3·7음을 최소 이동으로 연결 */
export function guideToneLine(symbols: string[]): { symbol: string; notes: Note[]; names: string[] }[] {
  const out: { symbol: string; notes: Note[]; names: string[] }[] = [];
  let prev: number[] | null = null;
  for (const s of symbols) {
    const chord = parseChord(s);
    if (!chord) continue;
    const third = pick(chord, 3), seventh = pick(chord, 7, -1);
    let t = placeInRange(degreeFrom(chord.root, third.degree, third.alter), C3 + 4, C3 + 15);
    let sv = placeInRange(degreeFrom(chord.root, seventh.degree, seventh.alter), C3 + 4, C3 + 15);
    if (prev) {
      // 이전 두 음에 가장 가깝게 배치
      const opts = [[t, sv], [sv, t]];
      let best = opts[0], bestScore = Infinity;
      for (const o of opts) {
        const score = Math.abs(toMidi(o[0]) - prev[0]) + Math.abs(toMidi(o[1]) - prev[1]);
        if (score < bestScore) { bestScore = score; best = o; }
      }
      [t, sv] = best;
    }
    prev = [toMidi(t), toMidi(sv)];
    out.push({ symbol: s, notes: [t, sv], names: [noteName(t, true), noteName(sv, true)] });
  }
  return out;
}
