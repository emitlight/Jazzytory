/**
 * Jazzytory — 스케일 & 코드 스케일 (Chord-Scale Theory)
 * ---------------------------------------------------------------------------
 * 핵심 원칙: 코드 스케일은 **코드 심볼만 보고 기계적으로 붙이지 않는다.**
 * 조성 안에서의 기능(function)을 먼저 판정하고, 그 결과로 스케일을 고른다.
 * 모든 도미넌트에 믹솔리디안을 붙이는 것이 가장 흔한 오류다.
 */

import {
  type Chord, type Note, degreeFrom, degreeSemitone, toMidi, pitchClass, noteName,
} from './theory';

export interface ScaleDegreeSpec { degree: number; alter: number }

export interface ScaleSpec {
  id: string;
  name: string;
  nameKo: string;
  degrees: ScaleDegreeSpec[];
  /** 이 스케일의 성격을 한 문장으로 */
  character: string;
}

const S = (degree: number, alter = 0): ScaleDegreeSpec => ({ degree, alter });

export const SCALES: Record<string, ScaleSpec> = {
  ionian:        { id: 'ionian',        name: 'Ionian',            nameKo: '아이오니안',        character: '메이저 조성의 으뜸. 4음(11)이 3음과 반음으로 부딪혀 어보이드가 된다.',     degrees: [S(1), S(2), S(3), S(4), S(5), S(6), S(7)] },
  dorian:        { id: 'dorian',        name: 'Dorian',            nameKo: '도리안',            character: '마이너7의 기본. 장6도가 이 스케일의 얼굴이다.',                              degrees: [S(1), S(2), S(3,-1), S(4), S(5), S(6), S(7,-1)] },
  phrygian:      { id: 'phrygian',      name: 'Phrygian',          nameKo: '프리지안',          character: 'b2가 특징. 스페인·플라멩코 색.',                                             degrees: [S(1), S(2,-1), S(3,-1), S(4), S(5), S(6,-1), S(7,-1)] },
  lydian:        { id: 'lydian',        name: 'Lydian',            nameKo: '리디안',            character: '#11이 떠 있는 느낌. IV∆7과 비기능적 ∆7에 쓴다.',                            degrees: [S(1), S(2), S(3), S(4,1), S(5), S(6), S(7)] },
  mixolydian:    { id: 'mixolydian',    name: 'Mixolydian',        nameKo: '믹솔리디안',        character: '다이어토닉 V7 전용. 4음은 어보이드.',                                        degrees: [S(1), S(2), S(3), S(4), S(5), S(6), S(7,-1)] },
  aeolian:       { id: 'aeolian',       name: 'Aeolian',           nameKo: '에올리안',          character: '자연단음계. b6이 어둡게 내려앉는다.',                                         degrees: [S(1), S(2), S(3,-1), S(4), S(5), S(6,-1), S(7,-1)] },
  locrian:       { id: 'locrian',       name: 'Locrian',           nameKo: '로크리안',          character: 'ø7의 기본. b2가 어보이드라 실전에서는 로크리안 #2를 더 많이 쓴다.',           degrees: [S(1), S(2,-1), S(3,-1), S(4), S(5,-1), S(6,-1), S(7,-1)] },
  locrianNat2:   { id: 'locrianNat2',   name: 'Locrian ♮2',        nameKo: '로크리안 내추럴2',  character: '멜로딕 마이너의 6번째 모드. ø7에 텐션 9를 쓸 수 있게 한다.',                  degrees: [S(1), S(2), S(3,-1), S(4), S(5,-1), S(6,-1), S(7,-1)] },
  lydianDom:     { id: 'lydianDom',     name: 'Lydian ♭7',         nameKo: '리디안 b7',         character: '트라이톤 서브와 비기능 도미넌트. #11이 자연스럽게 산다.',                     degrees: [S(1), S(2), S(3), S(4,1), S(5), S(6), S(7,-1)] },
  altered:       { id: 'altered',       name: 'Altered',           nameKo: '얼터드',            character: '멜로딕 마이너 7번째 모드. b9 #9 #11 b13 을 모두 품는 최대 긴장.',             degrees: [S(1), S(2,-1), S(3,-1), S(4,-1), S(5,-1), S(6,-1), S(7,-1)] },
  hm5:           { id: 'hm5',           name: 'Harmonic Minor P5 below', nameKo: '하모닉 마이너 P5 아래', character: '마이너 키의 V7. b9과 b13을 주되 3음은 장3도로 유지한다.',        degrees: [S(1), S(2,-1), S(3), S(4), S(5), S(6,-1), S(7,-1)] },
  melodicMinor:  { id: 'melodicMinor',  name: 'Melodic Minor',     nameKo: '멜로딕 마이너',     character: '-∆7의 스케일. 단3도 위에 장6·장7이 얹힌 특유의 밝은 어둠.',                  degrees: [S(1), S(2), S(3,-1), S(4), S(5), S(6), S(7)] },
  harmonicMinor: { id: 'harmonicMinor', name: 'Harmonic Minor',    nameKo: '하모닉 마이너',     character: 'b6과 장7 사이 증2도가 특징.',                                                degrees: [S(1), S(2), S(3,-1), S(4), S(5), S(6,-1), S(7)] },
  wholeTone:     { id: 'wholeTone',     name: 'Whole Tone',        nameKo: '홀톤',              character: '7#5 전용. 중력이 없는 부유감.',                                               degrees: [S(1), S(2), S(3), S(4,1), S(5,1), S(7,-1)] },
  dimHW:         { id: 'dimHW',         name: 'Diminished (H-W)',  nameKo: '디미니시 반온음',   character: '°7 코드용 8음 스케일.',                                                       degrees: [S(1), S(2,-1), S(3,-1), S(4,-1), S(5,-1), S(6,-1), S(6), S(7)] },
  dimWH:         { id: 'dimWH',         name: 'Diminished (W-H)',  nameKo: '디미니시 온반음',   character: '7b9(#9,#11,13) 도미넌트용. 대칭적이라 패턴이 그대로 단3도씩 이동한다.',       degrees: [S(1), S(2,-1), S(3,-1), S(3), S(4,1), S(5), S(6), S(7,-1)] },
  majorPenta:    { id: 'majorPenta',    name: 'Major Pentatonic',  nameKo: '메이저 펜타토닉',   character: '어보이드가 없어 안전하다. 중첩의 재료.',                                       degrees: [S(1), S(2), S(3), S(5), S(6)] },
  minorPenta:    { id: 'minorPenta',    name: 'Minor Pentatonic',  nameKo: '마이너 펜타토닉',   character: '블루스의 뼈대.',                                                              degrees: [S(1), S(3,-1), S(4), S(5), S(7,-1)] },
  blues:         { id: 'blues',         name: 'Blues Scale',       nameKo: '블루스 스케일',     character: '마이너 펜타토닉 + b5. 남용하면 유치해진다.',                                   degrees: [S(1), S(3,-1), S(4), S(5,-1), S(5), S(7,-1)] },
  bebopDom:      { id: 'bebopDom',      name: 'Bebop Dominant',    nameKo: '비밥 도미넌트',     character: '믹솔리디안 + 장7. 8음이라 강박에 코드톤이 정렬된다.',                          degrees: [S(1), S(2), S(3), S(4), S(5), S(6), S(7,-1), S(7)] },
  bebopMajor:    { id: 'bebopMajor',    name: 'Bebop Major',       nameKo: '비밥 메이저',       character: '아이오니안 + #5. 5음과 6음 사이를 메운다.',                                    degrees: [S(1), S(2), S(3), S(4), S(5), S(5,1), S(6), S(7)] },
  bebopDorian:   { id: 'bebopDorian',   name: 'Bebop Dorian',      nameKo: '비밥 도리안',       character: '도리안 + 장3도 경과음.',                                                       degrees: [S(1), S(2), S(3,-1), S(3), S(4), S(5), S(6), S(7,-1)] },
};

/** 스케일의 실제 음 */
export function scaleNotes(root: Note, scale: ScaleSpec): Note[] {
  return scale.degrees.map((d) => degreeFrom(root, d.degree, d.alter));
}

/* ─────────────────────  코드 스케일 판정  ───────────────────── */

export interface HarmonicContext {
  /** 조성 중심 (없으면 코드 단독 판단) */
  keyRoot?: Note;
  keyMode?: 'major' | 'minor';
  /** 다음 코드 — 해결 방향으로 기능을 판정할 때 쓴다 */
  next?: Chord;
  /** 기능 분석 결과를 외부에서 주입 */
  romanFunction?: string;
}

export interface ChordScaleResult {
  scale: ScaleSpec;
  notes: Note[];
  /** 왜 이 스케일인가 */
  rationale: string;
  /** 이 스케일에서 피해야 할 음 */
  avoid: Note[];
  /** 사용 가능한 텐션 */
  availableTensions: { degree: number; alter: number; note: Note; label: string }[];
}

const semitonesFromRoot = (root: Note, n: Note) => (((toMidi(n) - toMidi(root)) % 12) + 12) % 12;

/** 도미넌트인가 */
function isDominant(chord: Chord): boolean {
  return chord.quality === 'dom7' || chord.quality === 'altered'
    || chord.quality === 'dom7sharp5' || chord.quality === 'dom7sus4';
}

/** a 에서 b 로 완전5도 하행(=완전4도 상행)인가 */
function resolvesDownFifth(a: Note, b: Note): boolean {
  return (((toMidi(a) - toMidi(b)) % 12) + 12) % 12 === 7;
}
/** a 에서 b 로 반음 하행인가 (트라이톤 서브의 해결) */
function resolvesDownHalf(a: Note, b: Note): boolean {
  return (((toMidi(a) - toMidi(b)) % 12) + 12) % 12 === 1;
}

/**
 * 코드 스케일을 판정한다.
 * 판정 순서: (1) 명시된 얼터레이션 → (2) 조성 내 기능 → (3) 해결 방향 → (4) 코드 성질
 */
export function chordScale(chord: Chord, ctx: HarmonicContext = {}): ChordScaleResult {
  const { keyRoot, keyMode, next } = ctx;
  let scale: ScaleSpec;
  let rationale: string;

  const tensionAlters = chord.degrees.filter((d) => d.role === 'tension');
  const has = (deg: number, alt: number) => tensionAlters.some((t) => t.degree === deg && t.alter === alt);
  const fifthAlter = chord.degrees.find((d) => d.role === 'fifth')?.alter ?? 0;

  if (isDominant(chord)) {
    if (chord.quality === 'altered' || has(9, -1) && has(9, 1) || has(13, -1) && has(9, -1)) {
      scale = SCALES.altered;
      rationale = '얼터드 텐션(b9·#9·#11·b13)이 명시되어 있다. 멜로딕 마이너의 7번째 모드를 쓴다.';
    } else if (fifthAlter === 1 && !has(9, 0)) {
      scale = SCALES.wholeTone;
      rationale = '증5도 도미넌트다. 홀톤이 5음을 그대로 품는다.';
    } else if (has(9, -1) && (has(13, 0) || has(11, 1))) {
      scale = SCALES.dimWH;
      rationale = 'b9과 13(또는 #11)이 공존한다. 이 조합은 온반음 디미니시에서만 동시에 나온다.';
    } else if (has(11, 1)) {
      scale = SCALES.lydianDom;
      rationale = '#11이 명시되었다. 리디안 b7 이 #11을 자연스럽게 품는다.';
    } else if (chord.quality === 'dom7sus4') {
      scale = SCALES.mixolydian;
      rationale = 'sus4 도미넌트는 3음이 유예된 상태다. 믹솔리디안에서 4음이 오히려 주인공이 된다.';
    } else if (next && resolvesDownHalf(chord.root, next.root)) {
      scale = SCALES.lydianDom;
      rationale = '반음 아래로 해결한다 — 트라이톤 서브다. 리디안 b7 을 쓴다.';
    } else if (next && resolvesDownFifth(chord.root, next.root)) {
      const targetIsMinor = next.quality.startsWith('min') || next.quality === 'minMaj7';
      if (targetIsMinor) {
        scale = SCALES.hm5;
        rationale = '마이너 코드로 5도 해결한다. 목표 조성의 하모닉 마이너에서 파생된 HM5 를 쓴다(b9·b13).';
      } else if (keyRoot && semitonesFromRoot(keyRoot, chord.root) === 7 && keyMode === 'major') {
        scale = SCALES.mixolydian;
        rationale = '조성의 다이어토닉 V7 이다. 믹솔리디안을 쓰되 4음은 어보이드다.';
      } else {
        scale = SCALES.mixolydian;
        rationale = '5도 아래로 해결하는 세컨더리 도미넌트다. 목표 조성에서 파생된 믹솔리디안을 쓴다.';
      }
    } else if (keyRoot && keyMode === 'major' && semitonesFromRoot(keyRoot, chord.root) === 7) {
      scale = SCALES.mixolydian;
      rationale = '조성의 V7 이다. 믹솔리디안. 4음은 3음과 반음으로 부딪히므로 경과음으로만 쓴다.';
    } else if (keyRoot && semitonesFromRoot(keyRoot, chord.root) === 10) {
      scale = SCALES.lydianDom;
      rationale = 'bVII7 — 백도어 도미넌트다. 비기능 도미넌트이므로 리디안 b7.';
    } else {
      scale = SCALES.mixolydian;
      rationale = '해결 방향 정보가 없다. 기본형인 믹솔리디안에서 출발하되, 실제 진행을 보고 재판단하라.';
    }
  } else if (chord.quality === 'maj7' || chord.quality === 'maj6' || chord.quality === 'maj69' || chord.quality === 'maj') {
    if (has(11, 1)) {
      scale = SCALES.lydian;
      rationale = '#11이 명시되었다. 리디안.';
    } else if (keyRoot && keyMode === 'major' && semitonesFromRoot(keyRoot, chord.root) === 5) {
      scale = SCALES.lydian;
      rationale = '조성의 IV∆7 이다. 리디안을 쓰면 4음 어보이드 문제가 사라진다.';
    } else if (keyRoot && keyMode === 'major' && semitonesFromRoot(keyRoot, chord.root) === 0) {
      scale = SCALES.ionian;
      rationale = '조성의 I∆7 이다. 아이오니안. 4음은 어보이드.';
    } else {
      scale = SCALES.ionian;
      rationale = '메이저 7 코드의 기본. 4음이 3음과 반음으로 부딪히므로 지속음으로 쓰지 않는다.';
    }
  } else if (chord.quality === 'min7' || chord.quality === 'min' || chord.quality === 'min69') {
    if (keyRoot && keyMode === 'major' && semitonesFromRoot(keyRoot, chord.root) === 4) {
      scale = SCALES.phrygian;
      rationale = '조성의 iii-7 이다. 프리지안이지만 b2는 어보이드이므로 실전에서는 도리안으로 대체하기도 한다.';
    } else if (keyRoot && keyMode === 'major' && semitonesFromRoot(keyRoot, chord.root) === 9) {
      scale = SCALES.aeolian;
      rationale = '조성의 vi-7 이다. 에올리안.';
    } else if (keyRoot && keyMode === 'minor' && semitonesFromRoot(keyRoot, chord.root) === 0) {
      scale = SCALES.dorian;
      rationale = '마이너 조성의 i-7 이다. 재즈에서는 에올리안보다 도리안을 기본으로 삼는다.';
    } else {
      scale = SCALES.dorian;
      rationale = '마이너 7 의 기본. 장6도가 이 소리의 얼굴이다. ii-7 자리에서 특히 그렇다.';
    }
  } else if (chord.quality === 'min6') {
    scale = SCALES.dorian;
    rationale = '마이너 6 은 장6도를 코드톤으로 갖는다. 도리안 또는 멜로딕 마이너.';
  } else if (chord.quality === 'minMaj7') {
    scale = SCALES.melodicMinor;
    rationale = '단3도 + 장7도. 멜로딕 마이너가 그대로 코드 스케일이다.';
  } else if (chord.quality === 'halfDim7') {
    if (has(9, 0)) {
      scale = SCALES.locrianNat2;
      rationale = '9를 텐션으로 쓰려면 로크리안의 b2 대신 ♮2가 필요하다.';
    } else if (next && isDominant(next)) {
      scale = SCALES.locrianNat2;
      rationale = '마이너 ii-V 의 iiø7 이다. 로크리안 ♮2 가 실전 표준이다 — 로크리안의 b2는 멜로디를 막는다.';
    } else {
      scale = SCALES.locrian;
      rationale = 'ø7 의 기본. 다만 b2는 어보이드이므로 로크리안 ♮2를 먼저 시도하라.';
    }
  } else if (chord.quality === 'dim7' || chord.quality === 'dim') {
    scale = SCALES.dimHW;
    rationale = '°7 은 반온음 디미니시. 대칭이라 같은 패턴이 단3도마다 반복된다.';
  } else if (chord.quality === 'aug' || chord.quality === 'augMaj7') {
    scale = SCALES.wholeTone;
    rationale = '증5도. 홀톤 또는 멜로딕 마이너 3번째 모드(리디안 #5).';
  } else if (chord.quality === 'sus4' || chord.quality === 'sus2') {
    scale = SCALES.mixolydian;
    rationale = 'sus 코드는 3음이 유예된 상태. 믹솔리디안에서 4음이 중심이 된다.';
  } else {
    scale = SCALES.ionian;
    rationale = '기본 스케일.';
  }

  const notes = scaleNotes(chord.root, scale);
  const chordPcs = new Set(chord.degrees.filter((d) => d.role !== 'tension').map((d) => (degreeSemitone(d.degree) + d.alter + 12) % 12));

  const avoid: Note[] = [];
  const availableTensions: ChordScaleResult['availableTensions'] = [];
  const dominant = isDominant(chord);

  for (const d of scale.degrees) {
    const semi = ((degreeSemitone(d.degree) + d.alter) % 12 + 12) % 12;
    if (chordPcs.has(semi)) continue;
    // 코드톤 반음 위 = 어보이드 (도미넌트의 b9·#9·b13 은 예외)
    const halfStepAboveChordTone = chordPcs.has(((semi - 1) % 12 + 12) % 12);
    const tensionDegree = d.degree <= 2 ? d.degree + 7 : d.degree <= 4 ? d.degree + 7 : d.degree + 7;
    const note = degreeFrom(chord.root, d.degree, d.alter);
    if (halfStepAboveChordTone && !dominant) {
      avoid.push(note);
    } else if (halfStepAboveChordTone && dominant && semi !== 1 && semi !== 3 && semi !== 8) {
      avoid.push(note);
    } else {
      const label = `${d.alter > 0 ? '#' : d.alter < 0 ? 'b' : ''}${tensionDegree > 13 ? tensionDegree - 7 : tensionDegree}`;
      availableTensions.push({ degree: tensionDegree, alter: d.alter, note, label });
    }
  }

  return { scale, notes, rationale, avoid, availableTensions };
}

/** 스케일 음들을 읽기 좋은 문자열로 */
export function scaleNoteNames(root: Note, scale: ScaleSpec, glyph = true): string[] {
  return scaleNotes(root, scale).map((n) => noteName(n, glyph));
}

/** 두 음 집합의 공통 피치클래스 개수 — 스케일 유사도 */
export function pcOverlap(a: Note[], b: Note[]): number {
  const sa = new Set(a.map(pitchClass));
  return b.filter((n) => sa.has(pitchClass(n))).length;
}
