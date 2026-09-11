import { describe, it, expect } from 'vitest';
import {
  parseChord, chordNotes, chordTones, guideTones, noteName, transposeChord,
  degreeFrom, parseNoteName, toMidi, transposeNote, chordSymbol, toFrequency,
  parseIntervalName, intervalNameKo,
} from './theory';
import { chordScale, SCALES } from './scales';
import { analyzeProgression, summarizeCadences, guessKey } from './analysis';
import { makeVoicing, voiceProgression, voiceLeadingDistance, guideToneLine } from './voicing';

const names = (ns: ReturnType<typeof chordNotes>) => ns.map((n) => noteName(n));

describe('음 철자(spelling)', () => {
  it('Bb 위의 장3도는 C# 이 아니라 D 이다', () => {
    const bb = parseNoteName('Bb', 3)!;
    expect(noteName(degreeFrom(bb, 3, 0))).toBe('D');
  });

  it('Bb 위의 단7도는 Ab 이다', () => {
    const bb = parseNoteName('Bb', 3)!;
    expect(noteName(degreeFrom(bb, 7, -1))).toBe('Ab');
  });

  it('F# 위의 완전5도는 C# 이다', () => {
    const fs = parseNoteName('F#', 3)!;
    expect(noteName(degreeFrom(fs, 5, 0))).toBe('C#');
  });

  it('C4 는 MIDI 60 이다', () => {
    expect(toMidi(parseNoteName('C', 4)!)).toBe(60);
  });

  it('A4 는 440Hz 이다', () => {
    expect(toFrequency(parseNoteName('A', 4)!)).toBeCloseTo(440, 6);
  });

  it('이조해도 겹임시표가 남지 않는다', () => {
    const g = parseNoteName('G#', 4)!;
    for (let s = 1; s <= 12; s++) {
      const t = transposeNote(g, s, true);
      expect(Math.abs(t.alter)).toBeLessThanOrEqual(1);
    }
  });
});

describe('코드 심볼 파서', () => {
  it('Bb7 의 구성음은 Bb D F Ab', () => {
    expect(names(chordTones(parseChord('Bb7')!))).toEqual(['Bb', 'D', 'F', 'Ab']);
  });

  it('C∆7 의 구성음은 C E G B', () => {
    expect(names(chordTones(parseChord('C∆7')!))).toEqual(['C', 'E', 'G', 'B']);
  });

  it('D-7 의 구성음은 D F A C', () => {
    expect(names(chordTones(parseChord('D-7')!))).toEqual(['D', 'F', 'A', 'C']);
  });

  it('Bø7 의 구성음은 B D F A', () => {
    expect(names(chordTones(parseChord('Bø7')!))).toEqual(['B', 'D', 'F', 'A']);
  });

  it('C°7 의 7음은 겹플랫(Bbb)이다', () => {
    expect(names(chordTones(parseChord('C°7')!))).toEqual(['C', 'Eb', 'Gb', 'Bbb']);
  });

  it('C-∆7 의 구성음은 C Eb G B', () => {
    expect(names(chordTones(parseChord('C-∆7')!))).toEqual(['C', 'Eb', 'G', 'B']);
  });

  it('마이너 표기 변형(-7, m7, min7)이 모두 같게 파싱된다', () => {
    for (const s of ['C-7', 'Cm7', 'Cmin7']) {
      expect(parseChord(s)!.quality).toBe('min7');
    }
  });

  it('메이저7 표기 변형(∆7, M7, maj7, ^7)이 모두 같게 파싱된다', () => {
    for (const s of ['C∆7', 'CM7', 'Cmaj7', 'C^7']) {
      expect(parseChord(s)!.quality).toBe('maj7');
    }
  });

  it('하프디미니시 표기 변형(ø7, m7b5)이 같게 파싱된다', () => {
    expect(parseChord('Cø7')!.quality).toBe('halfDim7');
    expect(parseChord('Cm7b5')!.quality).toBe('halfDim7');
  });

  it('C7#11 은 #11 텐션을 갖는다', () => {
    const c = parseChord('C7#11')!;
    expect(c.degrees.some((d) => d.degree === 11 && d.alter === 1)).toBe(true);
    expect(names(chordTones(c))).toEqual(['C', 'E', 'G', 'Bb']);
  });

  it('C7alt 는 b9 #9 #11 b13 을 모두 갖는다', () => {
    const c = parseChord('C7alt')!;
    const has = (deg: number, alt: number) => c.degrees.some((d) => d.degree === deg && d.alter === alt);
    expect(has(9, -1) && has(9, 1) && has(11, 1) && has(13, -1)).toBe(true);
  });

  it('슬래시 코드의 베이스를 분리한다', () => {
    const c = parseChord('C/E')!;
    expect(noteName(c.bass!)).toBe('E');
    expect(c.quality).toBe('maj');
  });

  it('6/9 는 슬래시 베이스로 오인되지 않는다', () => {
    const c = parseChord('C6/9')!;
    expect(c.bass).toBeUndefined();
    expect(c.quality).toBe('maj69');
  });

  it('C13 은 9와 13을 함축한다', () => {
    const c = parseChord('C13')!;
    expect(c.degrees.some((d) => d.degree === 13)).toBe(true);
    expect(c.degrees.some((d) => d.degree === 9)).toBe(true);
  });

  it('파싱 불가능한 입력은 null 을 반환한다', () => {
    expect(parseChord('Hmm7')).toBeNull();
    expect(parseChord('')).toBeNull();
  });

  it('정규화 표기를 되돌려준다', () => {
    expect(chordSymbol(parseChord('Cmin7')!)).toBe('C-7');
    expect(chordSymbol(parseChord('Cmaj7')!)).toBe('C∆7');
  });
});

describe('가이드 톤', () => {
  it('G7 의 가이드 톤은 B 와 F', () => {
    expect(names(guideTones(parseChord('G7')!))).toEqual(['B', 'F']);
  });

  it('7음이 없는 C6 는 3음과 6음을 쓴다', () => {
    expect(names(guideTones(parseChord('C6')!))).toEqual(['E', 'A']);
  });
});

describe('이조', () => {
  it('D-7 을 5반음 올리면 G-7 이고 구성음 철자가 유지된다', () => {
    const t = transposeChord(parseChord('D-7')!, 5);
    expect(noteName(t.root)).toBe('G');
    expect(names(chordTones(t))).toEqual(['G', 'Bb', 'D', 'F']);
  });

  it('12키 순환 후 원위치로 돌아온다', () => {
    let c = parseChord('Eb∆7')!;
    for (let i = 0; i < 12; i++) c = transposeChord(c, 1);
    expect(toMidi(c.root) % 12).toBe(toMidi(parseChord('Eb∆7')!.root) % 12);
  });
});

describe('코드 스케일 — 기능 기반 판정', () => {
  it('메이저 조성의 V7 은 믹솔리디안', () => {
    const r = chordScale(parseChord('G7')!, { keyRoot: parseNoteName('C')!, keyMode: 'major', next: parseChord('C∆7')! });
    expect(r.scale.id).toBe('mixolydian');
  });

  it('마이너 코드로 해결하는 V7 은 HM5 (b9/b13)', () => {
    const r = chordScale(parseChord('G7')!, { keyRoot: parseNoteName('C')!, keyMode: 'minor', next: parseChord('C-7')! });
    expect(r.scale.id).toBe('hm5');
  });

  it('반음 아래로 해결하는 도미넌트는 리디안 b7 (트라이톤 서브)', () => {
    const r = chordScale(parseChord('Db7')!, { keyRoot: parseNoteName('C')!, keyMode: 'major', next: parseChord('C∆7')! });
    expect(r.scale.id).toBe('lydianDom');
  });

  it('7alt 는 얼터드 스케일', () => {
    expect(chordScale(parseChord('G7alt')!).scale.id).toBe('altered');
  });

  it('7#11 은 리디안 b7', () => {
    expect(chordScale(parseChord('G7#11')!).scale.id).toBe('lydianDom');
  });

  it('IV∆7 은 리디안 — 4음 어보이드 문제를 피한다', () => {
    const r = chordScale(parseChord('F∆7')!, { keyRoot: parseNoteName('C')!, keyMode: 'major' });
    expect(r.scale.id).toBe('lydian');
  });

  it('I∆7 은 아이오니안이고 4음(F)이 어보이드다', () => {
    const r = chordScale(parseChord('C∆7')!, { keyRoot: parseNoteName('C')!, keyMode: 'major' });
    expect(r.scale.id).toBe('ionian');
    expect(r.avoid.map((n) => noteName(n))).toContain('F');
  });

  it('도미넌트 앞의 ø7 은 로크리안 ♮2 를 쓴다', () => {
    const r = chordScale(parseChord('Dø7')!, { next: parseChord('G7alt')! });
    expect(r.scale.id).toBe('locrianNat2');
  });

  it('-∆7 은 멜로딕 마이너', () => {
    expect(chordScale(parseChord('C-∆7')!).scale.id).toBe('melodicMinor');
  });

  it('모든 스케일이 최소 5음 이상이다', () => {
    for (const s of Object.values(SCALES)) expect(s.degrees.length).toBeGreaterThanOrEqual(5);
  });
});

describe('기능 화성 분석', () => {
  it('C 조에서 D-7 G7 C∆7 을 ii-V-I 로 읽는다', () => {
    const a = analyzeProgression(['D-7', 'G7', 'C∆7'], 'C');
    expect(a[0].roman).toBe('ii-7');
    expect(a[1].roman).toBe('V7');
    expect(a[2].roman).toBe('I∆7');
    expect(a[0].cadenceGroup).toBe(a[2].cadenceGroup);
  });

  it('ii-V-I 를 한 덩어리로 요약한다', () => {
    const c = summarizeCadences(analyzeProgression(['D-7', 'G7', 'C∆7'], 'C'));
    expect(c).toHaveLength(1);
    expect(c[0].kind).toBe('major-ii-V-I');
  });

  it('세컨더리 도미넌트를 V7/x 로 표기한다', () => {
    const a = analyzeProgression(['C∆7', 'A7', 'D-7', 'G7'], 'C');
    expect(a[1].roman).toBe('V7/II');
    expect(a[1].role).toBe('secondary-dominant');
  });

  it('트라이톤 서브를 감지한다', () => {
    const a = analyzeProgression(['D-7', 'Db7', 'C∆7'], 'C');
    expect(a[1].role).toBe('tritone-sub');
  });

  it('마이너 ii-V-i 를 인식한다', () => {
    const c = summarizeCadences(analyzeProgression(['Dø7', 'G7alt', 'C-7'], 'C-'));
    expect(c[0].kind).toBe('minor-ii-V-i');
  });

  it('조성을 추정한다', () => {
    expect(guessKey(['D-7', 'G7', 'C∆7'])).toBe('C');
    expect(guessKey(['C-7', 'F7', 'Bb∆7', 'Bb∆7'])).toBe('Bb');
  });

  it('알 수 없는 심볼도 크래시하지 않는다', () => {
    const a = analyzeProgression(['D-7', '???', 'C∆7'], 'C');
    expect(a).toHaveLength(3);
    expect(a[1].role).toBe('unknown');
  });
});

describe('보이싱 엔진', () => {
  const midis = (v: ReturnType<typeof makeVoicing>) => v.notes.map((n) => toMidi(n.note));

  it('셸 A 는 근음·3음·7음 세 음이다', () => {
    const v = makeVoicing(parseChord('C7')!, 'shell-a');
    expect(v.notes.map((n) => n.role)).toEqual(['R', '3', 'b7']);
  });

  it('셸 보이싱은 낮은 쪽에서 위로 쌓인다', () => {
    const m = midis(makeVoicing(parseChord('C7')!, 'shell-a'));
    expect(m).toEqual([...m].sort((a, b) => a - b));
  });

  it('루트리스 A 는 근음을 포함하지 않는다', () => {
    const v = makeVoicing(parseChord('D-7')!, 'rootless-a');
    expect(v.notes.some((n) => n.role === 'R')).toBe(false);
    expect(v.notes).toHaveLength(4);
  });

  it('도미넌트의 루트리스 보이싱은 5음 대신 13음을 쓴다', () => {
    const v = makeVoicing(parseChord('G7')!, 'rootless-a');
    expect(v.notes.map((n) => n.role)).toContain('13');
    expect(v.notes.map((n) => n.role)).not.toContain('5');
  });

  it('얼터드 도미넌트의 루트리스는 b13 과 b9 을 쓴다', () => {
    const roles = makeVoicing(parseChord('G7alt')!, 'rootless-a').notes.map((n) => n.role);
    expect(roles).toContain('b13');
    expect(roles).toContain('b9');
  });

  it('모든 보이싱이 연주 가능한 음역(E1~C7) 안에 있다', () => {
    const styles = ['shell-a', 'shell-b', 'guide-tones', 'rootless-a', 'rootless-b', 'drop2', 'quartal', 'upper-structure', 'block', 'spread'] as const;
    for (const s of styles) {
      for (const sym of ['C∆7', 'D-7', 'G7', 'Bø7', 'Eb7alt', 'F#-7', 'Bb6/9']) {
        const v = makeVoicing(parseChord(sym)!, s);
        for (const n of v.notes) {
          expect(toMidi(n.note), `${s} ${sym} ${noteName(n.note)}`).toBeGreaterThanOrEqual(28);
          expect(toMidi(n.note), `${s} ${sym} ${noteName(n.note)}`).toBeLessThanOrEqual(96);
        }
      }
    }
  });

  it('어퍼 스트럭처는 왼손과 오른손으로 나뉜다', () => {
    const v = makeVoicing(parseChord('G7alt')!, 'upper-structure');
    expect(v.notes.some((n) => n.hand === 'L')).toBe(true);
    expect(v.notes.some((n) => n.hand === 'R')).toBe(true);
  });

  it('성부 진행 최적화가 ii-V-I 의 손 이동을 줄인다', () => {
    const optimized = voiceProgression(['D-7', 'G7', 'C∆7'], 'rootless-a', { alternateAB: true });
    let total = 0;
    for (let i = 0; i < optimized.length - 1; i++) total += voiceLeadingDistance(optimized[i], optimized[i + 1]);
    // A/B 교대 + 최소이동이면 코드당 평균 이동이 6반음 미만이어야 한다
    expect(total / (optimized.length - 1)).toBeLessThan(12);
  });

  it('가이드 톤 라인은 코드당 두 음이고 이동이 작다', () => {
    const line = guideToneLine(['D-7', 'G7', 'C∆7', 'A7']);
    expect(line).toHaveLength(4);
    for (const step of line) expect(step.notes).toHaveLength(2);
    for (let i = 0; i < line.length - 1; i++) {
      const move = Math.abs(toMidi(line[i].notes[0]) - toMidi(line[i + 1].notes[0]));
      expect(move).toBeLessThanOrEqual(5);
    }
  });

  it('°7 에 루트리스를 적용하면 경고가 나온다', () => {
    expect(makeVoicing(parseChord('C°7')!, 'rootless-a').warning).toBeTruthy();
  });
});

describe('인터벌 이름 파싱', () => {
  it.each([
    ['P1', 0], ['m2', 1], ['M2', 2], ['m3', 3], ['M3', 4], ['P4', 5],
    ['TT', 6], ['A4', 6], ['d5', 6], ['P5', 7], ['m6', 8], ['M6', 9],
    ['m7', 10], ['M7', 11], ['P8', 12], ['m9', 13], ['M9', 14], ['A9', 15],
    ['P11', 17], ['A11', 18], ['m13', 20], ['M13', 21],
  ])('%s = %i반음', (name, semis) => {
    expect(parseIntervalName(name as string)).toBe(semis);
  });

  it('완전음정 계열에 장/단을 붙이면 거부한다', () => {
    expect(parseIntervalName('M5')).toBeNull();
    expect(parseIntervalName('m4')).toBeNull();
  });

  it('장음정 계열에 완전을 붙이면 거부한다', () => {
    expect(parseIntervalName('P3')).toBeNull();
    expect(parseIntervalName('P6')).toBeNull();
  });

  it('알 수 없는 표기는 null', () => {
    expect(parseIntervalName('#11')).toBeNull();
    expect(parseIntervalName('')).toBeNull();
  });

  it('한국어 표기를 만든다', () => {
    expect(intervalNameKo('P5')).toBe('완전5도');
    expect(intervalNameKo('m7')).toBe('단7도');
    expect(intervalNameKo('A9')).toBe('증9도');
    expect(intervalNameKo('TT')).toBe('트라이톤');
  });
});

describe('보이싱 밀집도 — 손에 맞는가', () => {
  const styles = ['shell-a', 'shell-b', 'guide-tones', 'rootless-a', 'rootless-b',
    'drop2', 'quartal', 'upper-structure', 'block', 'spread'] as const;
  const symbols = ['C∆7', 'D-7', 'G7', 'Bø7', 'Eb7alt', 'F#-7', 'Bb6/9', 'A7b9', 'C-∆7'];

  it('인접 성부 간격이 한 옥타브를 넘지 않는다', () => {
    const bad: string[] = [];
    for (const s of styles) for (const sym of symbols) {
      const v = makeVoicing(parseChord(sym)!, s);
      const m = v.notes.map((n) => toMidi(n.note)).sort((a, b) => a - b);
      for (let i = 0; i < m.length - 1; i++) {
        // spread 는 의도적으로 근음을 낮게 두므로 최저 성부만 예외
        if (s === 'spread' && i === 0) continue;
        if (m[i + 1] - m[i] > 12) bad.push(`${s} ${sym}: ${m[i]}→${m[i + 1]}`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('4성부 보이싱의 전체 폭이 2옥타브를 넘지 않는다', () => {
    const bad: string[] = [];
    for (const s of ['rootless-a', 'rootless-b', 'drop2', 'block'] as const) {
      for (const sym of symbols) {
        const v = makeVoicing(parseChord(sym)!, s);
        const m = v.notes.map((n) => toMidi(n.note));
        const span = Math.max(...m) - Math.min(...m);
        if (span > 24) bad.push(`${s} ${sym}: ${span}반음`);
      }
    }
    expect(bad).toEqual([]);
  });

  it('D-7 루트리스 A 는 F3-A3-C4-E4 이다', () => {
    const v = makeVoicing(parseChord('D-7')!, 'rootless-a');
    expect(v.notes.map((n) => `${noteName(n.note)}${n.note.octave}`)).toEqual(['F3', 'A3', 'C4', 'E4']);
  });

  it('C7 셸 A 는 C3-E3-Bb3 이다', () => {
    const v = makeVoicing(parseChord('C7')!, 'shell-a');
    expect(v.notes.map((n) => `${noteName(n.note)}${n.note.octave}`)).toEqual(['C3', 'E3', 'Bb3']);
  });

  it('블록 코드는 같은 음을 오른손에서 중복하지 않는다', () => {
    for (const sym of symbols) {
      const v = makeVoicing(parseChord(sym)!, 'block');
      const rh = v.notes.filter((n) => n.hand === 'R').map((n) => toMidi(n.note));
      expect(new Set(rh).size, `${sym}: ${rh}`).toBe(rh.length);
    }
  });

  it('ii-V-I 의 코드당 평균 성부 이동이 4반음 미만이다', () => {
    const p = voiceProgression(['D-7', 'G7', 'C∆7'], 'rootless-a', { alternateAB: true });
    let total = 0;
    for (let i = 0; i < p.length - 1; i++) total += voiceLeadingDistance(p[i], p[i + 1]);
    expect(total / (p.length - 1)).toBeLessThan(4);
  });
});
