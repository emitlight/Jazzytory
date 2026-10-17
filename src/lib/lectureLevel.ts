/**
 * 오리지널 강의 목록의 레벨 필터 — 선택값 결정과 저장.
 * 우선순위: URL(?level=) → localStorage → 게시 강의가 있는 첫 레벨.
 */
export const LECTURE_LEVEL_KEY = 'jazzytory:lecture-level';
export const ALL_LEVELS = 'all';

export type LevelPick = typeof ALL_LEVELS | string;

export function isValidPick(v: unknown, levelIds: readonly string[]): v is LevelPick {
  return v === ALL_LEVELS || (typeof v === 'string' && levelIds.includes(v));
}

export function resolveInitialLevel(
  fromUrl: string | null,
  fromStorage: string | null,
  levels: readonly { id: string; publishedCount: number }[],
): LevelPick {
  const ids = levels.map((l) => l.id);
  if (isValidPick(fromUrl, ids)) return fromUrl;
  if (isValidPick(fromStorage, ids)) return fromStorage;
  return levels.find((l) => l.publishedCount > 0)?.id ?? ALL_LEVELS;
}

export function readStoredLevel(): string | null {
  try { return localStorage.getItem(LECTURE_LEVEL_KEY); } catch { return null; }
}

export function writeStoredLevel(v: LevelPick): void {
  try { localStorage.setItem(LECTURE_LEVEL_KEY, v); } catch { /* 사생활 보호 모드 등 — 기억만 못 할 뿐 동작은 같다 */ }
}
