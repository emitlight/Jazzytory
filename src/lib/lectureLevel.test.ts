import { describe, it, expect } from 'vitest';
import { resolveInitialLevel, ALL_LEVELS } from './lectureLevel';

const levels = [
  { id: 'L0', publishedCount: 0 },
  { id: 'L1', publishedCount: 6 },
  { id: 'L2', publishedCount: 6 },
  { id: 'L3', publishedCount: 0 },
];

describe('resolveInitialLevel', () => {
  it('URL 이 저장값보다 우선한다', () => {
    expect(resolveInitialLevel('L2', 'L1', levels)).toBe('L2');
    expect(resolveInitialLevel(ALL_LEVELS, 'L1', levels)).toBe(ALL_LEVELS);
  });
  it('URL 이 없거나 잘못되면 저장값을 쓴다', () => {
    expect(resolveInitialLevel(null, 'L1', levels)).toBe('L1');
    expect(resolveInitialLevel('L9', 'L2', levels)).toBe('L2');
  });
  it('둘 다 없으면 게시 강의가 있는 첫 레벨', () => {
    expect(resolveInitialLevel(null, null, levels)).toBe('L1');
    expect(resolveInitialLevel(null, 'junk', levels)).toBe('L1');
  });
  it('게시 강의가 하나도 없으면 전체', () => {
    expect(resolveInitialLevel(null, null, levels.map((l) => ({ ...l, publishedCount: 0 })))).toBe(ALL_LEVELS);
  });
});
