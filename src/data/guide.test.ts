import { describe, it, expect } from 'vitest';
import raw from './guide.json';
import { LECTURES } from './lectures';

/**
 * 가이드 영상은 강의 51편과 같은 플레이어를 쓰지만 LECTURES 와는 섞이면 안 된다.
 * (섞이면 홈의 시청 카운터가 51편을 넘어간다)
 * src/poster 에 base 를 붙이는 쪽은 guide.ts 이므로, 여기서는 원본 json 계약만 본다.
 */
describe('사용법 가이드 영상', () => {
  it('강의 51편(LECTURES)에는 들어 있지 않다', () => {
    expect(LECTURES.some((l) => l.id === raw.id)).toBe(false);
  });

  it('어느 차시에도 묶이지 않는다', () => {
    expect(raw.moduleId).toBe('');
  });

  it('영상·포스터 경로가 상대 경로다 (base 는 guide.ts 가 붙인다)', () => {
    expect(raw.src).toBe('guide/jazzytory-guide.mp4');
    expect(raw.poster).toBe('guide/poster.jpg');
    expect(raw.src.startsWith('/')).toBe(false);
  });

  it('챕터와 자막이 시간순으로 정렬되어 있다', () => {
    const sorted = (ts: number[]) => ts.every((t, i) => i === 0 || t >= ts[i - 1]);
    expect(sorted(raw.chapters.map((c) => c.t))).toBe(true);
    expect(sorted(raw.transcript.map((l) => l.t))).toBe(true);
  });

  it('모든 챕터·자막이 영상 길이 안에 있다', () => {
    expect(raw.durationSec).toBeGreaterThan(60);
    for (const c of raw.chapters) expect(c.t).toBeLessThan(raw.durationSec);
    for (const l of raw.transcript) expect(l.t).toBeLessThan(raw.durationSec);
  });

  it('빈 자막이나 빈 챕터 제목이 없다', () => {
    for (const c of raw.chapters) expect(c.title.trim().length).toBeGreaterThan(0);
    for (const l of raw.transcript) expect(l.text.trim().length).toBeGreaterThan(0);
  });

  it('자막에 마크다운 강조 기호가 새지 않는다', () => {
    for (const l of raw.transcript) expect(l.text).not.toMatch(/\*\*/);
  });
});
