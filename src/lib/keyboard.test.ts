import { describe, it, expect } from 'vitest';

/**
 * 건반 기하 계산 — Keyboard 컴포넌트와 동일한 식을 검증한다.
 * 컴포넌트에서 DOM 없이 순수 계산만 떼어내 테스트한다.
 */
const WHITE_PC = [0, 2, 4, 5, 7, 9, 11];
const isWhite = (midi: number) => WHITE_PC.includes(((midi % 12) + 12) % 12);
const BLACK_NUDGE: Record<number, number> = { 1: -0.09, 3: 0.09, 6: -0.11, 8: 0, 10: 0.11 };

function layout(lo: number, hi: number, whiteW = 34, blackW = 22) {
  const step = whiteW - 1;
  const whites: { midi: number; left: number; right: number }[] = [];
  const blacks: { midi: number; left: number; right: number }[] = [];
  let whitesBefore = 0;
  for (let midi = lo; midi <= hi; midi++) {
    if (isWhite(midi)) {
      whites.push({ midi, left: whitesBefore * step, right: whitesBefore * step + whiteW });
      whitesBefore++;
    } else if (whitesBefore > 0) {
      const pc = ((midi % 12) + 12) % 12;
      const left = whitesBefore * step - blackW / 2 + (BLACK_NUDGE[pc] ?? 0) * whiteW;
      blacks.push({ midi, left, right: left + blackW });
    }
  }
  return { whites, blacks };
}

describe('건반 기하', () => {
  it('한 옥타브에 흰건반 7개, 검은건반 5개', () => {
    const { whites, blacks } = layout(60, 71);
    expect(whites).toHaveLength(7);
    expect(blacks).toHaveLength(5);
  });

  it('검은건반은 항상 인접한 두 흰건반 사이에 걸친다', () => {
    const { whites, blacks } = layout(48, 84);
    for (const b of blacks) {
      const below = [...whites].filter((w) => w.midi < b.midi).pop();
      const above = whites.find((w) => w.midi > b.midi);
      expect(below, `${b.midi} 아래 흰건반 없음`).toBeDefined();
      expect(above, `${b.midi} 위 흰건반 없음`).toBeDefined();
      const center = b.left + 11;
      // 중심이 아래 흰건반의 오른쪽 절반과 위 흰건반의 왼쪽 절반 사이에 있어야 한다
      expect(center, `midi ${b.midi}`).toBeGreaterThan(below!.left + 17 * 0.5);
      expect(center, `midi ${b.midi}`).toBeLessThan(above!.right - 17 * 0.5);
    }
  });

  it('검은건반끼리 겹치지 않는다', () => {
    const { blacks } = layout(36, 96);
    const sorted = [...blacks].sort((a, b) => a.left - b.left);
    for (let i = 0; i < sorted.length - 1; i++) {
      expect(sorted[i].right, `${sorted[i].midi}`).toBeLessThanOrEqual(sorted[i + 1].left);
    }
  });

  it('검은건반의 순서가 MIDI 순서와 같다', () => {
    const { blacks } = layout(36, 96);
    for (let i = 0; i < blacks.length - 1; i++) {
      expect(blacks[i].left).toBeLessThan(blacks[i + 1].left);
    }
  });

  it('검은건반으로 시작하는 음역에서도 깨지지 않는다', () => {
    const { whites, blacks } = layout(61, 72);  // C#4 시작
    expect(whites.length).toBeGreaterThan(0);
    for (const b of blacks) expect(b.left).toBeGreaterThanOrEqual(0);
  });
});
