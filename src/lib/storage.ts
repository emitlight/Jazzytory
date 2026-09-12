/**
 * Jazzytory — 로컬 영속화
 * 백엔드가 없다. 모든 진도는 브라우저에 남는다.
 * 사파리 프라이빗 모드에서는 localStorage 접근 자체가 throw 하므로 전부 감싼다.
 */

import type { LevelId } from '../data/types';
import type { DrillState } from './mastery';
import { todayISO } from './mastery';

const KEY = 'jazzytory:v1';

export interface PracticeLogEntry {
  date: string;
  minutes: number;
  what: string;
  note?: string;
}

export interface UserState {
  placedLevel: LevelId | null;
  placementAnswers: Record<string, number>;
  drills: Record<string, DrillState>;
  completedModules: string[];
  favoriteTunes: string[];
  listened: string[];
  practiceLog: PracticeLogEntry[];
  settings: {
    theme: 'light' | 'dark' | 'system';
    bpm: number;
    swing: number;
    showRomanNumerals: boolean;
    notation: 'symbol' | 'text';
  };
}

export const DEFAULT_STATE: UserState = {
  placedLevel: null,
  placementAnswers: {},
  drills: {},
  completedModules: [],
  favoriteTunes: [],
  listened: [],
  practiceLog: [],
  settings: { theme: 'system', bpm: 120, swing: 1, showRomanNumerals: true, notation: 'symbol' },
};

export function loadState(): UserState {
  try {
    const raw = localStorage.getItem(KEY);
    if (!raw) return { ...DEFAULT_STATE };
    const parsed = JSON.parse(raw) as Partial<UserState>;
    return {
      ...DEFAULT_STATE,
      ...parsed,
      settings: { ...DEFAULT_STATE.settings, ...(parsed.settings ?? {}) },
      drills: parsed.drills ?? {},
    };
  } catch {
    return { ...DEFAULT_STATE };
  }
}

export function saveState(state: UserState): void {
  try {
    localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // 저장 실패해도 학습은 계속되어야 한다. 조용히 무시한다.
  }
}

export function logPractice(state: UserState, minutes: number, what: string, note?: string): UserState {
  const entry: PracticeLogEntry = { date: todayISO(), minutes, what, note };
  return { ...state, practiceLog: [...state.practiceLog, entry].slice(-500) };
}

export function totalPracticeMinutes(state: UserState): number {
  return state.practiceLog.reduce((s, e) => s + e.minutes, 0);
}

export function practiceDates(state: UserState): string[] {
  return [...new Set(state.practiceLog.map((e) => e.date))];
}

export function exportState(state: UserState): string {
  return JSON.stringify(state, null, 2);
}

export function importState(json: string): UserState | null {
  try {
    const parsed = JSON.parse(json) as Partial<UserState>;
    if (typeof parsed !== 'object' || parsed === null) return null;
    return { ...DEFAULT_STATE, ...parsed, settings: { ...DEFAULT_STATE.settings, ...(parsed.settings ?? {}) } };
  } catch {
    return null;
  }
}
