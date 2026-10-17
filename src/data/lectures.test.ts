import { describe, it, expect } from 'vitest';
import { LECTURES, lectureOfModule, lectureProblems, formatTime, type Lecture } from './lectures';
import { MODULES } from './index';
import { importState, loadState, DEFAULT_STATE } from '../lib/storage';

const moduleIds = new Set(MODULES.map((m) => m.id));

const fake = (over: Partial<Lecture> = {}): Lecture => ({
  id: 'lec-test',
  moduleId: MODULES[0].id,
  title: '테스트 강의',
  summary: '요약',
  src: 'https://example.com/a.mp4',
  poster: 'https://example.com/a.jpg',
  durationSec: 600,
  chapters: [{ t: 0, title: '도입' }, { t: 120, title: '본론' }],
  transcript: [{ t: 0, text: '첫 문장' }, { t: 4.5, text: '둘째 문장' }],
  publishedAt: '2026-10-17',
  version: 1,
  ...over,
});

describe('오리지널 강의 데이터', () => {
  it('lectures.json 이 계약을 지킨다 (모듈 존재 · 챕터/자막 정렬 · URL)', () => {
    expect(lectureProblems(LECTURES, moduleIds)).toEqual([]);
  });

  it('모든 강의는 lectureOfModule 로 찾을 수 있다', () => {
    for (const l of LECTURES) expect(lectureOfModule(l.moduleId)?.id).toBe(l.id);
    expect(lectureOfModule('없는-모듈')).toBeUndefined();
  });
});

describe('lectureProblems', () => {
  it('정상 항목은 통과한다', () => {
    expect(lectureProblems([fake()], moduleIds)).toEqual([]);
  });

  it('없는 모듈, 정렬 안 된 챕터·자막, http URL, 중복을 잡는다', () => {
    const bad = [
      fake({ moduleId: 'm-nope' }),
      fake({ id: 'b', moduleId: MODULES[1].id, chapters: [{ t: 60, title: 'b' }, { t: 10, title: 'a' }] }),
      fake({ id: 'c', moduleId: MODULES[2].id, transcript: [{ t: 0, text: 'x' }, { t: 0, text: 'y' }] }),
      fake({ id: 'd', moduleId: MODULES[3].id, src: 'http://example.com/a.mp4' }),
      fake({ id: 'd', moduleId: MODULES[3].id }),
      fake({ id: 'e', moduleId: MODULES[4].id, chapters: [{ t: 0, title: 'a' }, { t: 9999, title: 'b' }] }),
    ];
    const p = lectureProblems(bad, moduleIds).join('\n');
    expect(p).toMatch(/없는 모듈 m-nope/);
    expect(p).toMatch(/b: chapters 시각이 오름차순이 아니다/);
    expect(p).toMatch(/c: transcript 시각이 오름차순이 아니다/);
    expect(p).toMatch(/d: src 는 https/);
    expect(p).toMatch(/d: id 중복/);
    expect(p).toMatch(/e: chapters 시각이 영상 길이를 벗어난다/);
  });
});

describe('formatTime', () => {
  it.each([[0, '0:00'], [65, '1:05'], [599.9, '9:59'], [3723, '1:02:03']])('%s → %s', (s, out) => {
    expect(formatTime(s)).toBe(out);
  });
});

describe('진도 저장 하위 호환 (watchedLectures)', () => {
  it('필드가 없는 예전 내보내기도 가져온다', () => {
    const old = JSON.stringify({ completedModules: ['m-x'], settings: { theme: 'dark' } });
    const s = importState(old);
    expect(s?.completedModules).toEqual(['m-x']);
    expect(s?.watchedLectures).toEqual([]);
  });

  it('localStorage 가 없어도 기본값으로 시작한다', () => {
    expect(loadState().watchedLectures).toEqual(DEFAULT_STATE.watchedLectures);
  });
});
