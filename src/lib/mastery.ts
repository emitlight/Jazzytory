/**
 * Jazzytory — 숙련도 판정과 복습 스케줄 (Learning Science)
 * ---------------------------------------------------------------------------
 * 악기 연주 학습은 선언적 지식이 아니라 운동 기능 + 청각 패턴 인식의 획득이다.
 * 따라서 간격 반복을 "아는 것"이 아니라 **"치는 것"** 에 건다.
 *
 * 숙련 판정 3요소 (동시 충족)
 *   1) 목표 템포 도달
 *   2) 무오류 연속 회수
 *   3) **날짜가 다른** 세션에서의 재현  ← 하루 몰아치기로는 통과할 수 없다
 */

import type { SkillAxis, LevelId } from '../data/types';

export interface DrillAttempt {
  drillId: string;
  /** ISO date (YYYY-MM-DD) */
  date: string;
  bpm: number;
  /** 무오류로 끝냈는가 */
  clean: boolean;
  minutes: number;
}

export interface DrillState {
  drillId: string;
  attempts: DrillAttempt[];
  /** 0~100 */
  mastery: number;
  /** 다음 복습 권장일 (ISO date) */
  dueDate: string | null;
  /** 연속 실패 횟수 — 3 이상이면 난이도를 낮춘다 */
  consecutiveFails: number;
}

export const MASTERY_THRESHOLD = 80;

/** 간격 반복 단계 (일). 통과할 때마다 다음 단계로. */
const INTERVALS = [1, 2, 4, 8, 16, 30];

export function todayISO(d = new Date()): string {
  return new Date(d.getTime() - d.getTimezoneOffset() * 60000).toISOString().slice(0, 10);
}

export function addDays(iso: string, days: number): string {
  const d = new Date(iso + 'T00:00:00');
  d.setDate(d.getDate() + days);
  return todayISO(d);
}

export function daysBetween(a: string, b: string): number {
  return Math.round((new Date(b + 'T00:00:00').getTime() - new Date(a + 'T00:00:00').getTime()) / 86400000);
}

/**
 * 숙련도 계산.
 *  - 목표 템포 대비 달성률 (50%)
 *  - 무오류 비율 (30%)
 *  - 서로 다른 날짜의 성공 세션 수 (20%)  ← 재현성
 */
export function computeMastery(attempts: DrillAttempt[], targetBpm: number): number {
  if (!attempts.length) return 0;
  const recent = attempts.slice(-12);
  const cleanOnes = recent.filter((a) => a.clean);

  const bestBpm = Math.max(0, ...cleanOnes.map((a) => a.bpm));
  const tempoScore = Math.min(1, bestBpm / targetBpm);

  const cleanRate = recent.length ? cleanOnes.length / recent.length : 0;

  const distinctDays = new Set(cleanOnes.map((a) => a.date)).size;
  const reproScore = Math.min(1, distinctDays / 3);

  return Math.round((tempoScore * 0.5 + cleanRate * 0.3 + reproScore * 0.2) * 100);
}

/** 다음 복습일. 성공할수록 간격이 벌어진다. */
export function nextDueDate(state: Omit<DrillState, 'dueDate'>, from = todayISO()): string {
  const cleanStreak = countTrailingClean(state.attempts);
  const step = Math.min(cleanStreak, INTERVALS.length - 1);
  if (state.consecutiveFails >= 2) return addDays(from, 1);
  return addDays(from, INTERVALS[Math.max(0, step)]);
}

function countTrailingClean(attempts: DrillAttempt[]): number {
  let n = 0;
  for (let i = attempts.length - 1; i >= 0; i--) {
    if (attempts[i].clean) n++;
    else break;
  }
  return n;
}

export function recordAttempt(state: DrillState | undefined, attempt: DrillAttempt, targetBpm: number): DrillState {
  const base: DrillState = state ?? { drillId: attempt.drillId, attempts: [], mastery: 0, dueDate: null, consecutiveFails: 0 };
  const attempts = [...base.attempts, attempt].slice(-40);
  const consecutiveFails = attempt.clean ? 0 : base.consecutiveFails + 1;
  const next: Omit<DrillState, 'dueDate'> = {
    drillId: base.drillId, attempts,
    mastery: computeMastery(attempts, targetBpm),
    consecutiveFails,
  };
  return { ...next, dueDate: nextDueDate(next, attempt.date) };
}

/** 3회 연속 실패 → 난이도 하향 권고 */
export function shouldStepBack(state: DrillState): boolean {
  return state.consecutiveFails >= 3;
}

/** 오늘 해야 할 드릴 — 기한이 지났거나 오늘인 것 */
export function dueDrills(states: Record<string, DrillState>, on = todayISO()): string[] {
  return Object.values(states)
    .filter((s) => s.dueDate !== null && daysBetween(s.dueDate, on) >= 0 && s.mastery < 100)
    .sort((a, b) => (a.dueDate! < b.dueDate! ? -1 : 1))
    .map((s) => s.drillId);
}

/**
 * 인터리빙 세션 생성기.
 * 한 키를 20분 연속 하는 것보다 여러 키를 섞는 편이 전이가 좋다.
 */
export function buildSession(
  candidates: { drillId: string; minutes: number; axis: SkillAxis[] }[],
  totalMinutes: number,
): { drillId: string; minutes: number }[] {
  if (!candidates.length) return [];
  const chunk = 5;
  const out: { drillId: string; minutes: number }[] = [];
  let used = 0;
  let i = 0;
  const remaining = new Map(candidates.map((c) => [c.drillId, c.minutes]));
  // 축이 연속으로 겹치지 않게 라운드로빈
  const ordered = [...candidates].sort((a, b) => a.axis[0]?.localeCompare(b.axis[0] ?? '') ?? 0);
  while (used < totalMinutes && [...remaining.values()].some((m) => m > 0)) {
    const c = ordered[i % ordered.length];
    i++;
    const left = remaining.get(c.drillId) ?? 0;
    if (left <= 0) continue;
    const take = Math.min(chunk, left, totalMinutes - used);
    if (take <= 0) break;
    if (out.length && out[out.length - 1].drillId === c.drillId) continue;
    out.push({ drillId: c.drillId, minutes: take });
    remaining.set(c.drillId, left - take);
    used += take;
  }
  return out;
}

/* ───────────────────  레벨 진행도  ─────────────────── */

export interface AxisScore { axis: SkillAxis; value: number }

export function axisScores(
  drillStates: Record<string, DrillState>,
  drillAxisMap: Record<string, SkillAxis[]>,
): AxisScore[] {
  const sums: Partial<Record<SkillAxis, { total: number; count: number }>> = {};
  for (const [id, st] of Object.entries(drillStates)) {
    for (const ax of drillAxisMap[id] ?? []) {
      const cur = sums[ax] ?? { total: 0, count: 0 };
      cur.total += st.mastery; cur.count += 1;
      sums[ax] = cur;
    }
  }
  const axes: SkillAxis[] = ['harmony', 'voicing', 'melody', 'rhythm', 'ear', 'repertoire', 'technique', 'form'];
  return axes.map((axis) => {
    const s = sums[axis];
    return { axis, value: s && s.count ? Math.round(s.total / s.count) : 0 };
  });
}

/** 모듈 완료 판정 — 모든 드릴이 임계치를 넘었는가 */
export function moduleProgress(
  moduleDrillIds: string[],
  drillStates: Record<string, DrillState>,
): { completed: number; total: number; percent: number; passed: boolean } {
  const total = moduleDrillIds.length;
  const completed = moduleDrillIds.filter((id) => (drillStates[id]?.mastery ?? 0) >= MASTERY_THRESHOLD).length;
  return {
    completed, total,
    percent: total ? Math.round((completed / total) * 100) : 0,
    passed: total > 0 && completed === total,
  };
}

/** 연습 스트릭 — 죄책감 설계를 피하려 누적 분(minute)과 함께 쓴다 */
export function practiceStreak(dates: string[], today = todayISO()): number {
  const set = new Set(dates);
  let streak = 0;
  let cursor = today;
  if (!set.has(cursor)) cursor = addDays(cursor, -1);
  while (set.has(cursor)) { streak++; cursor = addDays(cursor, -1); }
  return streak;
}

export const LEVEL_ORDER: LevelId[] = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];
