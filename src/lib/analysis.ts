/**
 * Jazzytory — 기능 화성 분석 (Functional Harmonic Analysis)
 * ---------------------------------------------------------------------------
 * 리드시트의 코드 나열을 **문장**으로 읽게 만드는 층.
 * ii-V-I 을 하나의 덩어리로 보기 시작하는 순간 학습자의 암보 속도가 달라진다.
 */

import {
  type Chord, type Note, toMidi, parseChord, noteName, parseNoteName,
} from './theory';

export type HarmonicRole =
  | 'tonic' | 'subdominant' | 'dominant'
  | 'secondary-dominant' | 'tritone-sub' | 'related-ii'
  | 'modal-interchange' | 'diminished-passing' | 'non-diatonic' | 'unknown';

export interface ChordAnalysis {
  chord: Chord;
  /** 로마숫자 표기. 예: "ii-7", "V7", "subV7/V" */
  roman: string;
  role: HarmonicRole;
  /** 사람이 읽는 설명 */
  explain: string;
  /** ii-V(-I) 묶음의 그룹 번호. 같은 번호끼리 한 문장이다. */
  cadenceGroup?: number;
  /** 이 코드가 속한 임시 조성 중심 (전조·세컨더리 도미넌트일 때) */
  localKey?: string;
}

export interface KeyContext {
  root: Note;
  mode: 'major' | 'minor';
}

export function parseKey(key: string): KeyContext {
  const trimmed = key.trim();
  const minor = /(-|m|min)$/i.test(trimmed);
  const rootStr = trimmed.replace(/(-|m|min)$/i, '');
  const root = parseNoteName(rootStr, 4) ?? parseNoteName('C', 4)!;
  return { root, mode: minor ? 'minor' : 'major' };
}

const pcDist = (from: Note, to: Note) => (((toMidi(to) - toMidi(from)) % 12) + 12) % 12;

const ROMAN_MAJOR = ['I', 'bII', 'II', 'bIII', 'III', 'IV', '#IV', 'V', 'bVI', 'VI', 'bVII', 'VII'];
const ROMAN_MINOR = ['i', 'bII', 'ii', 'bIII', 'iii', 'iv', '#iv', 'v', 'bVI', 'vi', 'bVII', 'vii'];

/**
 * 로마숫자의 대소문자를 코드 성질에 맞춘다.
 * 장·증·도미넌트는 대문자, 단·감은 소문자. 임시표 접두사(b, #)는 그대로 둔다.
 * 마이너 조성 표에 소문자로 저장된 V 를 그대로 쓰면 V7 이 v7 로 나와 도미넌트가 아닌 것처럼 보인다.
 */
function caseNumeral(numeral: string, upper: boolean): string {
  const m = /^([b#]*)(.*)$/.exec(numeral);
  if (!m) return numeral;
  return m[1] + (upper ? m[2].toUpperCase() : m[2].toLowerCase());
}

/** 코드 성질에 따른 로마숫자 접미사 */
function romanSuffix(chord: Chord): string {
  switch (chord.quality) {
    case 'maj7': case 'maj': return '∆7';
    case 'maj6': case 'maj69': return '6';
    case 'min7': case 'min': return '-7';
    case 'min6': case 'min69': return '-6';
    case 'minMaj7': return '-∆7';
    case 'dom7': case 'dom7sharp5': return '7';
    case 'altered': return '7alt';
    case 'dom7sus4': return '7sus4';
    case 'sus4': case 'sus2': return 'sus';
    case 'halfDim7': return 'ø7';
    case 'dim7': return '°7';
    case 'dim': return '°';
    case 'aug': case 'augMaj7': return '+';
    default: return '';
  }
}

/** 장조 다이어토닉 기대 성질 */
const DIATONIC_MAJOR: Record<number, string[]> = {
  0: ['maj7', 'maj6', 'maj69', 'maj'],
  2: ['min7', 'min'],
  4: ['min7', 'min'],
  5: ['maj7', 'maj6', 'maj69', 'maj'],
  7: ['dom7', 'dom7sus4', 'sus4'],
  9: ['min7', 'min'],
  11: ['halfDim7'],
};
/** 단조(하모닉/자연/멜로딕 혼합) 기대 성질 */
const DIATONIC_MINOR: Record<number, string[]> = {
  0: ['min7', 'min', 'minMaj7', 'min6'],
  2: ['halfDim7', 'min7'],
  3: ['maj7', 'maj6', 'maj69'],
  5: ['min7', 'min', 'min6'],
  7: ['dom7', 'min7', 'altered'],
  8: ['maj7', 'maj6'],
  10: ['dom7', 'maj7'],
  11: ['dim7'],
};

const isDom = (c: Chord) => c.quality === 'dom7' || c.quality === 'altered'
  || c.quality === 'dom7sharp5' || c.quality === 'dom7sus4';
const isMinorish = (c: Chord) => c.quality === 'min7' || c.quality === 'min' || c.quality === 'min6' || c.quality === 'minMaj7';

/**
 * 진행 전체를 분석한다.
 * @param symbols 코드 심볼 배열 (마디 순서)
 * @param key 조성 문자열 ("Bb", "C-")
 */
export function analyzeProgression(symbols: string[], key: string): ChordAnalysis[] {
  const ctx = parseKey(key);
  const chords = symbols.map((s) => parseChord(s));
  const out: ChordAnalysis[] = [];
  let group = 0;

  // 블루스 판정 — 토닉 위 도미넌트 7이 두 번 이상 나오면 그 코드는 "IV 로 가는 문"이 아니라
  // "집"이다. F 블루스의 F7 을 V7/IV 로 읽으면 학습자에게 거짓말을 하는 셈이 된다.
  const tonicDomCount = chords.filter(
    (c) => c && isDom(c) && pcDist(ctx.root, c.root) === 0,
  ).length;
  const bluesish = tonicDomCount >= 2;

  for (let i = 0; i < chords.length; i++) {
    const chord = chords[i];
    if (!chord) {
      out.push({
        chord: parseChord('C')!, roman: '?', role: 'unknown',
        explain: `코드 심볼 "${symbols[i]}" 을 해석하지 못했다.`,
      });
      continue;
    }
    const next = chords[i + 1] ?? undefined;
    const dist = pcDist(ctx.root, chord.root);
    const table = ctx.mode === 'major' ? DIATONIC_MAJOR : DIATONIC_MINOR;
    const numerals = ctx.mode === 'major' ? ROMAN_MAJOR : ROMAN_MINOR;
    const suffix = romanSuffix(chord);
    let roman = numerals[dist] + suffix;
    let role: HarmonicRole = 'non-diatonic';
    let explain = '';
    let localKey: string | undefined;

    const diatonicQualities = table[dist];
    const isDiatonic = !!diatonicQualities && diatonicQualities.includes(chord.quality);

    if (isDiatonic) {
      const lowercase = isMinorish(chord) || chord.quality === 'halfDim7'
        || chord.quality === 'dim7' || chord.quality === 'dim';
      roman = caseNumeral(numerals[dist], !lowercase) + suffix;
      if (dist === 0) { role = 'tonic'; explain = '토닉. 도착점이다.'; }
      else if (dist === 9 && ctx.mode === 'major') { role = 'tonic'; explain = '토닉 대리(vi). I 과 두 음을 공유한다.'; }
      else if (dist === 4 && ctx.mode === 'major') { role = 'tonic'; explain = '토닉 대리(iii).'; }
      else if (dist === 5 || dist === 2) { role = 'subdominant'; explain = dist === 2 ? '서브도미넌트(ii). V 로 가려는 힘이 가장 크다.' : '서브도미넌트(IV).'; }
      else if (dist === 7) { role = 'dominant'; explain = '도미넌트. 3음과 b7음의 트라이톤이 토닉으로 끌어당긴다.'; }
      else if (dist === 11) { role = 'dominant'; explain = 'viiø7. V7 의 대리로 쓰인다.'; }
      else if (ctx.mode === 'minor' && dist === 3) { role = 'tonic'; explain = '상대 장조의 토닉(bIII). 마이너 조성의 밝은 쪽 문.'; }
      else if (ctx.mode === 'minor' && dist === 10) { role = 'subdominant'; explain = 'bVII7. 백도어로 자주 쓰인다.'; }
      else { role = 'subdominant'; explain = '다이어토닉 코드.'; }
    } else if (isDom(chord) && bluesish && dist === 0) {
      roman = 'I7';
      role = 'tonic';
      explain = '블루스의 토닉. 도미넌트 7이지만 해결해야 할 긴장이 아니라 도착점이다. '
        + '재즈 화성의 V7 과 달리 여기서는 b7 이 색이지 추진력이 아니다.';
    } else if (isDom(chord) && bluesish && dist === 5) {
      roman = 'IV7';
      role = 'subdominant';
      explain = '블루스의 IV7. 5마디에서 화면이 한 번 밝아졌다가 다시 I7 으로 돌아온다. '
        + '여기서 b7(IV7 의 7음)이 I7 의 근음으로 반음 하행하는 것이 블루스 사운드의 핵심이다.';
    } else if (isDom(chord)) {
      // 세컨더리 도미넌트 / 트라이톤 서브 판정
      const targetPc = (pcDist(ctx.root, chord.root) + 5) % 12;  // 5도 아래 = +5 반음
      const subTargetPc = (pcDist(ctx.root, chord.root) + 11) % 12; // 반음 아래
      const nextPc = next ? pcDist(ctx.root, next.root) : -1;

      if (next && nextPc === subTargetPc && !(next && nextPc === targetPc)) {
        roman = `subV7/${caseNumeral(numerals[subTargetPc], true)}`;
        role = 'tritone-sub';
        localKey = noteName(next.root, true);
        explain = `트라이톤 서브. 반음 아래 ${noteName(next.root, true)} 로 미끄러진다. 원래의 ${numerals[(subTargetPc + 7) % 12]}7 과 트라이톤을 공유한다.`;
      } else if (dist === 7 && ctx.mode === 'major') {
        role = 'dominant'; explain = '조성의 V7.';
      } else if (next && nextPc === targetPc) {
        roman = `V7/${caseNumeral(numerals[targetPc], true)}`;
        role = 'secondary-dominant';
        localKey = noteName(next.root, true);
        explain = `세컨더리 도미넌트. ${numerals[targetPc]} 를 일시적 토닉으로 만든다. 스케일은 ${noteName(next.root, true)} 조성에서 가져온다.`;
      } else if (dist === 10) {
        roman = 'bVII7'; role = 'modal-interchange';
        explain = '백도어 도미넌트. 동주단조에서 빌려온 bVII7 이 I∆7 로 해결한다.';
      } else if (dist === 1) {
        roman = 'subV7'; role = 'tritone-sub';
        explain = 'bII7 — V7 의 트라이톤 서브. 베이스가 반음으로 내려앉는다.';
      } else {
        roman = `V7/${caseNumeral(numerals[targetPc], true)}`;
        role = 'secondary-dominant';
        explain = `${caseNumeral(numerals[targetPc], true)} 를 향하는 도미넌트로 읽힌다. 실제 해결이 생략되었을 수 있다.`;
      }
    } else if (chord.quality === 'dim7') {
      role = 'diminished-passing';
      explain = '경과 디미니시. 대개 반음 위/아래 다이어토닉 코드로 연결된다. 3음 위의 7b9 로 바꿔 읽으면 기능이 보인다.';
    } else if (isMinorish(chord) && next && isDom(next) && pcDist(chord.root, next.root) === 5) {
      roman = caseNumeral(numerals[dist], false) + suffix;
      role = 'related-ii';
      localKey = noteName(next.root, true);
      explain = `다음 도미넌트의 관계 ii. ${noteName(next.root, true)}7 과 한 덩어리로 읽어라 — 두 코드가 아니라 한 문장이다.`;
    } else if (chord.quality === 'halfDim7' && next && isDom(next)) {
      roman = caseNumeral(numerals[dist], false) + suffix;
      role = 'related-ii';
      explain = '마이너 ii-V 의 iiø7. 뒤의 도미넌트는 대개 얼터드다.';
    } else if (ctx.mode === 'major' && (dist === 8 || dist === 10 || dist === 3 || dist === 5)) {
      role = 'modal-interchange';
      explain = '동주단조에서 빌려온 코드(모달 인터체인지). 갑자기 그늘이 지는 지점이다.';
    } else {
      explain = '조성 밖의 코드. 앞뒤 코드와의 연결로 기능을 읽어야 한다.';
    }

    out.push({ chord, roman, role, explain, localKey });
  }

  // ii-V(-I) 묶기
  for (let i = 0; i < out.length - 1; i++) {
    const a = out[i], b = out[i + 1];
    const aIsII = isMinorish(a.chord) || a.chord.quality === 'halfDim7';
    if (aIsII && isDom(b.chord) && pcDist(a.chord.root, b.chord.root) === 5) {
      group += 1;
      a.cadenceGroup = group;
      b.cadenceGroup = group;
      const c = out[i + 2];
      if (c && pcDist(b.chord.root, c.chord.root) === 5 && !isDom(c.chord)) {
        c.cadenceGroup = group;
      }
    }
  }
  return out;
}

/** 진행에서 ii-V-I 덩어리만 뽑아 요약 */
export interface CadenceSummary {
  group: number;
  chords: string[];
  target: string;
  kind: 'major-ii-V-I' | 'minor-ii-V-i' | 'ii-V (미해결)';
}

export function summarizeCadences(analysis: ChordAnalysis[]): CadenceSummary[] {
  const byGroup = new Map<number, ChordAnalysis[]>();
  for (const a of analysis) {
    if (a.cadenceGroup === undefined) continue;
    const arr = byGroup.get(a.cadenceGroup) ?? [];
    arr.push(a);
    byGroup.set(a.cadenceGroup, arr);
  }
  return [...byGroup.entries()].map(([group, items]) => {
    const resolved = items.length >= 3;
    const last = items[items.length - 1].chord;
    const minor = resolved && (last.quality.startsWith('min') || last.quality === 'minMaj7');
    return {
      group,
      chords: items.map((i) => i.chord.input || noteName(i.chord.root, true)),
      target: resolved ? noteName(last.root, true) : noteName(items[1].chord.root, true) + ' (해결 생략)',
      kind: !resolved ? 'ii-V (미해결)' : minor ? 'minor-ii-V-i' : 'major-ii-V-I',
    };
  });
}

/** 진행의 조성을 추정한다 (조표 미상 리드시트용) */
export function guessKey(symbols: string[]): string {
  const chords = symbols.map((s) => parseChord(s)).filter((c): c is Chord => !!c);
  if (!chords.length) return 'C';
  const scores = new Map<string, number>();
  for (let pc = 0; pc < 12; pc++) {
    for (const mode of ['major', 'minor'] as const) {
      const keyRoot = { step: 0, alter: pc, octave: 4 } as Note;
      const table = mode === 'major' ? DIATONIC_MAJOR : DIATONIC_MINOR;
      let score = 0;
      for (const c of chords) {
        const d = (((toMidi(c.root) - toMidi(keyRoot)) % 12) + 12) % 12;
        if (table[d]?.includes(c.quality)) score += 2;
        else if (table[d]) score += 1;
      }
      // 마지막 코드가 토닉이면 가산
      const lastD = (((toMidi(chords[chords.length - 1].root) - toMidi(keyRoot)) % 12) + 12) % 12;
      if (lastD === 0) score += 3;
      const names = ['C', 'Db', 'D', 'Eb', 'E', 'F', 'Gb', 'G', 'Ab', 'A', 'Bb', 'B'];
      scores.set(names[pc] + (mode === 'minor' ? '-' : ''), score);
    }
  }
  return [...scores.entries()].sort((a, b) => b[1] - a[1])[0][0];
}
