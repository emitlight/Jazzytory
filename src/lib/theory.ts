/**
 * Jazzytory — 음악 이론 엔진 (Music Theory Engine)
 * ---------------------------------------------------------------------------
 * 이 엔진이 틀리면 서비스가 학습자에게 거짓말을 한다. 모든 변경에는 테스트가 따른다.
 *
 * 설계 요지
 *  - 음을 피치클래스(0~11)가 아니라 **문자(step) + 임시표(alter) + 옥타브**로 표현한다.
 *    Bb7 의 3음은 D 이지 C# 이 아니다. 이조해도 철자가 무너지지 않아야 한다.
 *  - 코드는 **도수(degree) + 변화(alter)** 의 집합으로 표현한다. (예: b7 = {degree:7, alter:-1})
 *  - 코드 스케일은 기계적 매핑이 아니라 **조성 안에서의 기능**으로 판정한다.
 */

/* ───────────────────────────── 음(Note) ───────────────────────────── */

/** step: C=0, D=1, E=2, F=3, G=4, A=5, B=6 */
export interface Note {
  step: number;
  /** 반음 단위 임시표. -2=𝄫, -1=♭, 0=natural, 1=♯, 2=𝄪 */
  alter: number;
  /** 과학적 음고 표기 옥타브. C4 = 가온다 = MIDI 60 */
  octave: number;
}

const STEP_LETTER = ['C', 'D', 'E', 'F', 'G', 'A', 'B'] as const;
/** 각 문자의 자연음 반음 위치 */
const STEP_SEMI = [0, 2, 4, 5, 7, 9, 11] as const;

const ACCIDENTAL_TEXT: Record<number, string> = {
  [-2]: 'bb', [-1]: 'b', 0: '', 1: '#', 2: '##',
};
const ACCIDENTAL_GLYPH: Record<number, string> = {
  [-2]: '𝄫', [-1]: '♭', 0: '', 1: '♯', 2: '𝄪',
};

export function note(step: number, alter = 0, octave = 4): Note {
  return { step, alter, octave };
}

/** MIDI 번호. C4 = 60 */
export function toMidi(n: Note): number {
  return STEP_SEMI[((n.step % 7) + 7) % 7] + n.alter + 12 * (n.octave + 1);
}

export function pitchClass(n: Note): number {
  return ((toMidi(n) % 12) + 12) % 12;
}

/** 옥타브 없는 음이름. 예: "Bb", "F#" */
export function noteName(n: Note, glyph = false): string {
  const table = glyph ? ACCIDENTAL_GLYPH : ACCIDENTAL_TEXT;
  const acc = table[n.alter] ?? (n.alter > 0 ? '#'.repeat(n.alter) : 'b'.repeat(-n.alter));
  return STEP_LETTER[((n.step % 7) + 7) % 7] + acc;
}

/** 옥타브 포함 표기. 예: "Bb3" */
export function noteNameOctave(n: Note, glyph = false): string {
  return noteName(n, glyph) + n.octave;
}

/** 한국어 음이름 (스크린리더/접근성용). 예: "시♭ 3옥타브" */
const STEP_KO = ['도', '레', '미', '파', '솔', '라', '시'] as const;
export function noteNameKo(n: Note): string {
  const acc = n.alter === 0 ? '' : n.alter > 0 ? '샵'.repeat(n.alter) : '플랫'.repeat(-n.alter);
  return `${STEP_KO[((n.step % 7) + 7) % 7]}${acc} ${n.octave}옥타브`;
}

export function parseNoteName(s: string, octave = 4): Note | null {
  const m = /^([A-Ga-g])([#b♯♭x𝄪𝄫]*)$/.exec(s.trim());
  if (!m) return null;
  const step = STEP_LETTER.indexOf(m[1].toUpperCase() as (typeof STEP_LETTER)[number]);
  if (step < 0) return null;
  let alter = 0;
  for (const ch of m[2]) {
    if (ch === '#' || ch === '♯') alter += 1;
    else if (ch === 'b' || ch === '♭') alter -= 1;
    else if (ch === 'x' || ch === '𝄪') alter += 2;
    else if (ch === '𝄫') alter -= 2;
  }
  return { step, alter, octave };
}

/** 도수(1,3,5,7,9,11,13...)의 장음계 기준 반음 수 */
export function degreeSemitone(degree: number): number {
  const idx = degree - 1;
  return STEP_SEMI[((idx % 7) + 7) % 7] + 12 * Math.floor(idx / 7);
}

/**
 * 근음으로부터 도수/변화만큼 떨어진 음을 **철자를 지켜** 만든다.
 * degreeFrom(Bb, 3, 0) === D  (C# 이 아님)
 */
export function degreeFrom(root: Note, degree: number, alter = 0): Note {
  const stepOffset = degree - 1;
  const absStep = root.step + stepOffset;
  const step = ((absStep % 7) + 7) % 7;
  const octaveShift = Math.floor(absStep / 7);
  const octave = root.octave + octaveShift;
  const targetSemi = toMidi(root) + degreeSemitone(degree) + alter;
  const naturalSemi = STEP_SEMI[step] + 12 * (octave + 1);
  return { step, alter: targetSemi - naturalSemi, octave };
}

/** 반음 단위 이조. 철자는 `preferFlats` 로 조절한다. */
export function transposeNote(n: Note, semitones: number, preferFlats = false): Note {
  // 온음계 단계 수를 추정해 철자가 무너지지 않게 한다.
  const diatonicStep = Math.round((semitones * 7) / 12);
  const absStep = n.step + diatonicStep;
  const step = ((absStep % 7) + 7) % 7;
  const octave = n.octave + Math.floor(absStep / 7);
  const target = toMidi(n) + semitones;
  const natural = STEP_SEMI[step] + 12 * (octave + 1);
  let result: Note = { step, alter: target - natural, octave };
  // 겹임시표가 나오면 이명동음으로 단순화
  if (Math.abs(result.alter) > 1) result = simplifySpelling(result, preferFlats);
  return result;
}

/** 겹샵/겹플랫을 제거한 이명동음 철자 */
export function simplifySpelling(n: Note, preferFlats = false): Note {
  const midi = toMidi(n);
  const pc = ((midi % 12) + 12) % 12;
  const octave = Math.floor(midi / 12) - 1;
  const sharpMap: [number, number][] = [[0, 0], [0, 1], [1, 0], [1, 1], [2, 0], [3, 0], [3, 1], [4, 0], [4, 1], [5, 0], [5, 1], [6, 0]];
  const flatMap: [number, number][] = [[0, 0], [1, -1], [1, 0], [2, -1], [2, 0], [3, 0], [4, -1], [4, 0], [5, -1], [5, 0], [6, -1], [6, 0]];
  const [step, alter] = (preferFlats ? flatMap : sharpMap)[pc];
  return { step, alter, octave };
}

export function midiToNote(midi: number, preferFlats = false): Note {
  return simplifySpelling({ step: 0, alter: midi - 12 * (Math.floor(midi / 12)), octave: Math.floor(midi / 12) - 1 }, preferFlats);
}

/** 주파수(A4=440) */
export function toFrequency(n: Note, a4 = 440): number {
  return a4 * Math.pow(2, (toMidi(n) - 69) / 12);
}

/* ───────────────────────────── 코드(Chord) ───────────────────────────── */

export interface ChordDegree {
  degree: number;
  alter: number;
  /** 코드톤인가 텐션인가 */
  role: 'root' | 'third' | 'fifth' | 'seventh' | 'sixth' | 'tension' | 'sus';
}

export type ChordQualityId =
  | 'maj' | 'maj7' | 'maj6' | 'maj69' | 'min' | 'min7' | 'min6' | 'min69' | 'minMaj7'
  | 'dom7' | 'halfDim7' | 'dim' | 'dim7' | 'aug' | 'augMaj7' | 'dom7sharp5'
  | 'sus4' | 'sus2' | 'dom7sus4' | 'altered' | 'power';

interface QualitySpec {
  id: ChordQualityId;
  /** 기본 구성음 */
  degrees: ChordDegree[];
  /** 화면 표기 접미사 */
  suffix: string;
  ko: string;
  /** 기능 분류 */
  family: 'major' | 'minor' | 'dominant' | 'diminished' | 'augmented' | 'suspended';
}

const D = (degree: number, alter: number, role: ChordDegree['role']): ChordDegree => ({ degree, alter, role });

const QUALITIES: Record<ChordQualityId, QualitySpec> = {
  maj:        { id: 'maj',        suffix: '',      ko: '장3화음',        family: 'major',      degrees: [D(1,0,'root'), D(3,0,'third'), D(5,0,'fifth')] },
  maj7:       { id: 'maj7',       suffix: '∆7',    ko: '메이저 7',       family: 'major',      degrees: [D(1,0,'root'), D(3,0,'third'), D(5,0,'fifth'), D(7,0,'seventh')] },
  maj6:       { id: 'maj6',       suffix: '6',     ko: '메이저 6',       family: 'major',      degrees: [D(1,0,'root'), D(3,0,'third'), D(5,0,'fifth'), D(6,0,'sixth')] },
  maj69:      { id: 'maj69',      suffix: '6/9',   ko: '식스 나인',      family: 'major',      degrees: [D(1,0,'root'), D(3,0,'third'), D(5,0,'fifth'), D(6,0,'sixth'), D(9,0,'tension')] },
  min:        { id: 'min',        suffix: '-',     ko: '단3화음',        family: 'minor',      degrees: [D(1,0,'root'), D(3,-1,'third'), D(5,0,'fifth')] },
  min7:       { id: 'min7',       suffix: '-7',    ko: '마이너 7',       family: 'minor',      degrees: [D(1,0,'root'), D(3,-1,'third'), D(5,0,'fifth'), D(7,-1,'seventh')] },
  min6:       { id: 'min6',       suffix: '-6',    ko: '마이너 6',       family: 'minor',      degrees: [D(1,0,'root'), D(3,-1,'third'), D(5,0,'fifth'), D(6,0,'sixth')] },
  min69:      { id: 'min69',      suffix: '-6/9',  ko: '마이너 식스나인', family: 'minor',     degrees: [D(1,0,'root'), D(3,-1,'third'), D(5,0,'fifth'), D(6,0,'sixth'), D(9,0,'tension')] },
  minMaj7:    { id: 'minMaj7',    suffix: '-∆7',   ko: '마이너 메이저 7', family: 'minor',     degrees: [D(1,0,'root'), D(3,-1,'third'), D(5,0,'fifth'), D(7,0,'seventh')] },
  dom7:       { id: 'dom7',       suffix: '7',     ko: '도미넌트 7',     family: 'dominant',   degrees: [D(1,0,'root'), D(3,0,'third'), D(5,0,'fifth'), D(7,-1,'seventh')] },
  halfDim7:   { id: 'halfDim7',   suffix: 'ø7',    ko: '하프 디미니시',  family: 'diminished', degrees: [D(1,0,'root'), D(3,-1,'third'), D(5,-1,'fifth'), D(7,-1,'seventh')] },
  dim:        { id: 'dim',        suffix: '°',     ko: '감3화음',        family: 'diminished', degrees: [D(1,0,'root'), D(3,-1,'third'), D(5,-1,'fifth')] },
  dim7:       { id: 'dim7',       suffix: '°7',    ko: '디미니시 7',     family: 'diminished', degrees: [D(1,0,'root'), D(3,-1,'third'), D(5,-1,'fifth'), D(7,-2,'seventh')] },
  aug:        { id: 'aug',        suffix: '+',     ko: '증3화음',        family: 'augmented',  degrees: [D(1,0,'root'), D(3,0,'third'), D(5,1,'fifth')] },
  augMaj7:    { id: 'augMaj7',    suffix: '∆7#5',  ko: '증 메이저 7',    family: 'augmented',  degrees: [D(1,0,'root'), D(3,0,'third'), D(5,1,'fifth'), D(7,0,'seventh')] },
  dom7sharp5: { id: 'dom7sharp5', suffix: '7#5',   ko: '도미넌트 7 샵5', family: 'dominant',   degrees: [D(1,0,'root'), D(3,0,'third'), D(5,1,'fifth'), D(7,-1,'seventh')] },
  sus4:       { id: 'sus4',       suffix: 'sus4',  ko: '서스4',          family: 'suspended',  degrees: [D(1,0,'root'), D(4,0,'sus'), D(5,0,'fifth')] },
  sus2:       { id: 'sus2',       suffix: 'sus2',  ko: '서스2',          family: 'suspended',  degrees: [D(1,0,'root'), D(2,0,'sus'), D(5,0,'fifth')] },
  dom7sus4:   { id: 'dom7sus4',   suffix: '7sus4', ko: '도미넌트 7 서스4', family: 'suspended', degrees: [D(1,0,'root'), D(4,0,'sus'), D(5,0,'fifth'), D(7,-1,'seventh')] },
  altered:    { id: 'altered',    suffix: '7alt',  ko: '얼터드 도미넌트', family: 'dominant',  degrees: [D(1,0,'root'), D(3,0,'third'), D(7,-1,'seventh'), D(9,-1,'tension'), D(9,1,'tension'), D(11,1,'tension'), D(13,-1,'tension')] },
  power:      { id: 'power',      suffix: '5',     ko: '5도 화음',       family: 'major',      degrees: [D(1,0,'root'), D(5,0,'fifth')] },
};

export interface Chord {
  /** 입력 원문 */
  input: string;
  root: Note;
  quality: ChordQualityId;
  /** 근음 포함 전체 구성음의 도수 정의 (텐션 포함) */
  degrees: ChordDegree[];
  /** 슬래시 베이스 */
  bass?: Note;
  /** 표기용 텐션 문자열 (예: ["#11"]) */
  tensionLabels: string[];
}

const QUALITY_TOKENS: [RegExp, ChordQualityId][] = [
  [/^(?:maj|Maj|MAJ|M|∆|Δ|\^)7(?!#5)/,       'maj7'],
  [/^(?:maj|Maj|M|∆|Δ|\^)9/,                 'maj7'],
  [/^(?:maj|Maj|M|∆|Δ|\^)13/,                'maj7'],
  [/^(?:maj|Maj|M|∆|Δ|\^)7#5/,               'augMaj7'],
  [/^6\/9|^69/,                              'maj69'],
  [/^(?:min|m|-)6\/9|^(?:min|m|-)69/,        'min69'],
  [/^(?:min|m|-)(?:maj|Maj|M|∆|Δ|\^)7/,      'minMaj7'],
  [/^(?:min|m|-)7b5|^(?:min|m|-)7\(b5\)/,    'halfDim7'],
  [/^ø7|^ø/,                                 'halfDim7'],
  [/^(?:min|m|-)7/,                           'min7'],
  [/^(?:min|m|-)9|^(?:min|m|-)11|^(?:min|m|-)13/, 'min7'],
  [/^(?:min|m|-)6/,                          'min6'],
  [/^(?:min|m|-)(?![a-zA-Z])/,               'min'],
  [/^dim7|^°7|^o7/,                          'dim7'],
  [/^dim|^°|^o(?![a-zA-Z])/,                 'dim'],
  [/^7alt|^alt/,                             'altered'],
  [/^7sus4|^7sus/,                           'dom7sus4'],
  [/^sus4|^sus(?!2)/,                        'sus4'],
  [/^sus2/,                                  'sus2'],
  [/^aug7|^7#5|^7\+5/,                       'dom7sharp5'],
  [/^aug|^\+/,                               'aug'],
  [/^13|^11|^9(?!\))/,                       'dom7'],
  [/^7/,                                     'dom7'],
  [/^6/,                                     'maj6'],
  [/^5(?![#b])/,                             'power'],
];

/** 자동으로 따라붙는 텐션 (9, 11, 13 표기) */
const IMPLIED_TENSIONS: [RegExp, { degree: number; alter: number }[]][] = [
  [/^(?:maj|Maj|M|∆|Δ|\^)13/, [{ degree: 9, alter: 0 }, { degree: 13, alter: 0 }]],
  [/^(?:maj|Maj|M|∆|Δ|\^)9/,  [{ degree: 9, alter: 0 }]],
  [/^(?:min|m|-)13/,          [{ degree: 9, alter: 0 }, { degree: 11, alter: 0 }, { degree: 13, alter: 0 }]],
  [/^(?:min|m|-)11/,          [{ degree: 9, alter: 0 }, { degree: 11, alter: 0 }]],
  [/^(?:min|m|-)9/,           [{ degree: 9, alter: 0 }]],
  [/^13/,                     [{ degree: 9, alter: 0 }, { degree: 13, alter: 0 }]],
  [/^11/,                     [{ degree: 9, alter: 0 }, { degree: 11, alter: 0 }]],
  [/^9(?!\))/,                [{ degree: 9, alter: 0 }]],
];

const TENSION_RE = /(?:\(([^)]*)\)|(?:(b|♭|#|♯|\+|-)(5|9|11|13))|add(9|11|13|4|2))/g;

/** 코드 심볼 파서. 실패하면 null. */
export function parseChord(input: string, rootOctave = 4): Chord | null {
  const raw = input.trim();
  if (!raw) return null;
  // 슬래시 베이스 분리 (단, 6/9 는 예외)
  let body = raw;
  let bass: Note | undefined;
  const slash = /\/([A-G][#b♯♭]?)$/.exec(raw);
  if (slash && !/6\/9$/.test(raw)) {
    bass = parseNoteName(slash[1], rootOctave - 1) ?? undefined;
    body = raw.slice(0, slash.index);
  }

  const rootMatch = /^([A-G])([#b♯♭]*)/.exec(body);
  if (!rootMatch) return null;
  const root = parseNoteName(rootMatch[1] + rootMatch[2], rootOctave);
  if (!root) return null;
  let rest = body.slice(rootMatch[0].length);

  let quality: ChordQualityId | null = null;
  let matchedLen = 0;
  for (const [re, q] of QUALITY_TOKENS) {
    const m = re.exec(rest);
    if (m) { quality = q; matchedLen = m[0].length; break; }
  }
  if (quality === null) {
    // 접미사가 전혀 없으면 장3화음
    if (rest === '' || /^\(/.test(rest)) quality = 'maj';
    else return null;
  }

  const tensions: { degree: number; alter: number }[] = [];
  for (const [re, ts] of IMPLIED_TENSIONS) {
    if (re.test(rest)) { tensions.push(...ts); break; }
  }
  rest = rest.slice(matchedLen);

  // 명시 텐션 파싱
  const labels: string[] = [];
  let alteredFifth: number | null = null;
  const scan = (segment: string) => {
    TENSION_RE.lastIndex = 0;
    let m: RegExpExecArray | null;
    while ((m = TENSION_RE.exec(segment)) !== null) {
      if (m[1] !== undefined) { scan(m[1]); continue; }
      if (m[4] !== undefined) {
        const deg = Number(m[4]) === 4 ? 11 : Number(m[4]) === 2 ? 9 : Number(m[4]);
        tensions.push({ degree: deg, alter: 0 });
        labels.push(`add${m[4]}`);
        continue;
      }
      const sign = m[2] === '#' || m[2] === '♯' || m[2] === '+' ? 1 : -1;
      const deg = Number(m[3]);
      if (deg === 5) { alteredFifth = sign; labels.push(`${sign > 0 ? '#' : 'b'}5`); continue; }
      tensions.push({ degree: deg, alter: sign });
      labels.push(`${sign > 0 ? '#' : 'b'}${deg}`);
    }
  };
  scan(rest);

  const spec = QUALITIES[quality];
  const degrees: ChordDegree[] = spec.degrees.map((d) => ({ ...d }));

  if (alteredFifth !== null) {
    const fifth = degrees.find((d) => d.role === 'fifth');
    if (fifth) fifth.alter = alteredFifth;
    else degrees.push(D(5, alteredFifth, 'fifth'));
  }
  for (const t of tensions) {
    // 같은 도수의 기존 항목이 있으면 갱신, 없으면 추가
    const existing = degrees.find((d) => d.degree === t.degree && d.role === 'tension');
    if (existing && existing.alter === t.alter) continue;
    if (degrees.some((d) => d.degree === t.degree && d.alter === t.alter)) continue;
    degrees.push(D(t.degree, t.alter, 'tension'));
  }
  // -7(11) 등에서 11 이 장3도와 부딪히는 경우는 그대로 둔다(연주자 판단).

  return {
    input: raw,
    root,
    quality,
    degrees: degrees.sort((a, b) => a.degree - b.degree || a.alter - b.alter),
    bass,
    tensionLabels: labels,
  };
}

/** 코드의 실제 음 (근음 옥타브 기준, 텐션 포함) */
export function chordNotes(chord: Chord, opts: { includeTensions?: boolean } = {}): Note[] {
  const include = opts.includeTensions ?? true;
  return chord.degrees
    .filter((d) => include || d.role !== 'tension')
    .map((d) => degreeFrom(chord.root, d.degree, d.alter));
}

/** 코드톤만 (1,3,5,7 또는 6) */
export function chordTones(chord: Chord): Note[] {
  return chord.degrees
    .filter((d) => d.role !== 'tension')
    .map((d) => degreeFrom(chord.root, d.degree, d.alter));
}

/** 가이드 톤 (3음·7음). 3음이 없으면 sus 음, 7음이 없으면 6음 */
export function guideTones(chord: Chord): Note[] {
  const third = chord.degrees.find((d) => d.role === 'third') ?? chord.degrees.find((d) => d.role === 'sus');
  const seventh = chord.degrees.find((d) => d.role === 'seventh') ?? chord.degrees.find((d) => d.role === 'sixth');
  const out: Note[] = [];
  if (third) out.push(degreeFrom(chord.root, third.degree, third.alter));
  if (seventh) out.push(degreeFrom(chord.root, seventh.degree, seventh.alter));
  return out;
}

/** 정규화된 표기 문자열 */
export function chordSymbol(chord: Chord, glyph = false): string {
  const spec = QUALITIES[chord.quality];
  const tens = chord.tensionLabels.length ? `(${chord.tensionLabels.join(',')})` : '';
  const bass = chord.bass ? `/${noteName(chord.bass, glyph)}` : '';
  return `${noteName(chord.root, glyph)}${spec.suffix}${tens}${bass}`;
}

export function chordQualityKo(chord: Chord): string { return QUALITIES[chord.quality].ko; }
export function chordFamily(chord: Chord): QualitySpec['family'] { return QUALITIES[chord.quality].family; }

/** 코드 전체를 반음 이조 */
export function transposeChord(chord: Chord, semitones: number, preferFlats?: boolean): Chord {
  const flats = preferFlats ?? shouldPreferFlats(pitchClass(chord.root) + semitones);
  return {
    ...chord,
    root: transposeNote(chord.root, semitones, flats),
    bass: chord.bass ? transposeNote(chord.bass, semitones, flats) : undefined,
    input: '',
  };
}

/** F, Bb, Eb, Ab, Db, Gb 계열은 플랫 철자를 선호한다 */
export function shouldPreferFlats(pc: number): boolean {
  const p = ((pc % 12) + 12) % 12;
  return [1, 3, 5, 8, 10].includes(p);
}

/* ───────────────────────────── 인터벌 ───────────────────────────── */

/** 완전음정 계열 도수인가 (1, 4, 5, 8, 11, 12, 15 …) */
function isPerfectDegree(degree: number): boolean {
  const idx = ((degree - 1) % 7 + 7) % 7;
  return idx === 0 || idx === 3 || idx === 4;
}

/**
 * 인터벌 이름을 반음 수로. 실패하면 null.
 * 지원: P1 m2 M2 m3 M3 P4 A4/TT d5 P5 m6 M6 m7 M7 P8 m9 M9 A9 P11 A11 m13 M13 …
 * 겹증·겹감(AA4, dd5)도 받는다.
 */
export function parseIntervalName(name: string): number | null {
  const s = name.trim();
  if (s === 'TT' || s === 'tt') return 6;
  const m = /^(P|M|m|A+|d+)(\d+)$/.exec(s);
  if (!m) return null;
  const quality = m[1];
  const degree = Number(m[2]);
  if (!Number.isFinite(degree) || degree < 1) return null;
  const base = degreeSemitone(degree);
  const perfect = isPerfectDegree(degree);

  if (quality === 'P') return perfect ? base : null;
  if (quality === 'M') return perfect ? null : base;
  if (quality === 'm') return perfect ? null : base - 1;
  if (quality.startsWith('A')) return base + quality.length;
  if (quality.startsWith('d')) return base - quality.length - (perfect ? 0 : 1);
  return null;
}

const INTERVAL_QUALITY_KO: Record<string, string> = { P: '완전', M: '장', m: '단', A: '증', d: '감' };

/** 인터벌 이름의 한국어 표기. 예: "P5" → "완전5도", "TT" → "트라이톤" */
export function intervalNameKo(name: string): string {
  const s = name.trim();
  if (s === 'TT' || s === 'tt') return '트라이톤';
  const m = /^(P|M|m|A+|d+)(\d+)$/.exec(s);
  if (!m) return s;
  const q = m[1][0];
  const prefix = m[1].length > 1 ? (q === 'A' ? '겹증' : '겹감') : INTERVAL_QUALITY_KO[q] ?? '';
  return `${prefix}${m[2]}도`;
}
