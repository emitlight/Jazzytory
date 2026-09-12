/**
 * Jazzytory — 콘텐츠 인덱스
 * ---------------------------------------------------------------------------
 * 모든 콘텐츠 데이터를 한 곳에서 모으고 **역인덱스**를 만든다.
 *
 * 왜 역인덱스인가: 커리큘럼 작성자는 "이 모듈에 이 곡"이라고 쓰고,
 * 레퍼토리 작성자는 "이 곡은 이 모듈에서"라고 쓴다. 둘 다 맞다.
 * 양방향을 합집합으로 병합해 어느 쪽에서 써도 연결이 살아 있게 한다.
 */

import type {
  Level, Module, Tune, Album, VideoResource, Reviewer,
  GlossaryEntry, LevelId, Drill, SkillAxis, TeachingMethod, MethodApplication,
} from './types';

import { LEVELS } from './levels';
import { MODULES_L0L2 } from './modules.l0l2';
import { MODULES_L2B } from './modules.l2b';
import { MODULES_L3L5 } from './modules.l3l5';
import { MODULES_L6L8 } from './modules.l6l8';
import { TUNES } from './tunes';
import { ALBUMS } from './albums';
import { VIDEOS, CHANNELS } from './videos';
import { FACULTY } from './faculty';
import { GLOSSARY } from './glossary';
import { EAR_DRILLS } from './earDrills';
import { PLACEMENT } from './placement';
import { TEACHING_METHODS, PRACTICE_PARAMETERS } from './pedagogy';
import { METHOD_APPLICATIONS } from './pedagogyMap';

/* ───────────────── 원본 컬렉션 ───────────────── */

const RAW_MODULES: Module[] = [...MODULES_L0L2, ...MODULES_L2B, ...MODULES_L3L5, ...MODULES_L6L8];

/** 모듈 id → 역참조로 모인 항목들 */
function reverseIndex<T extends { id: string; relatedModules?: string[] }>(items: T[]): Map<string, string[]> {
  const m = new Map<string, string[]>();
  for (const item of items) {
    for (const mod of item.relatedModules ?? []) {
      const arr = m.get(mod) ?? [];
      if (!arr.includes(item.id)) arr.push(item.id);
      m.set(mod, arr);
    }
  }
  return m;
}

const albumsByModule = reverseIndex(ALBUMS);
const videosByModule = reverseIndex(VIDEOS);

/** 튠은 relatedModules 대신 levelId 로만 묶이므로 별도 처리하지 않는다 */
const merge = (a: string[] | undefined, b: string[] | undefined) =>
  [...new Set([...(a ?? []), ...(b ?? [])])];

/** 양방향 참조를 병합한 최종 모듈 목록 */
export const MODULES: Module[] = RAW_MODULES.map((m) => ({
  ...m,
  listening: merge(m.listening, albumsByModule.get(m.id)),
  videos: merge(m.videos, videosByModule.get(m.id)),
})).sort((a, b) => {
  const la = LEVELS.findIndex((l) => l.id === a.levelId);
  const lb = LEVELS.findIndex((l) => l.id === b.levelId);
  return la - lb || a.order - b.order;
});

export {
  LEVELS, TUNES, ALBUMS, VIDEOS, CHANNELS, FACULTY, GLOSSARY, EAR_DRILLS, PLACEMENT,
  TEACHING_METHODS, PRACTICE_PARAMETERS, METHOD_APPLICATIONS,
};

/* ─────────────────  교수법 인덱스  ───────────────── */

export const METHOD_BY_ID = new Map<string, TeachingMethod>(TEACHING_METHODS.map((m) => [m.id, m]));

const applicationsByModule = (() => {
  const m = new Map<string, MethodApplication[]>();
  for (const a of METHOD_APPLICATIONS) {
    const arr = m.get(a.moduleId) ?? [];
    arr.push(a);
    m.set(a.moduleId, arr);
  }
  return m;
})();

const applicationsByMethod = (() => {
  const m = new Map<string, MethodApplication[]>();
  for (const a of METHOD_APPLICATIONS) {
    const arr = m.get(a.methodId) ?? [];
    arr.push(a);
    m.set(a.methodId, arr);
  }
  return m;
})();

/** 이 모듈에 적용되는 교수법들 */
export function methodsOfModule(moduleId: string): { method: TeachingMethod; application: MethodApplication }[] {
  return (applicationsByModule.get(moduleId) ?? [])
    .map((application) => {
      const method = METHOD_BY_ID.get(application.methodId);
      return method ? { method, application } : null;
    })
    .filter((x): x is { method: TeachingMethod; application: MethodApplication } => !!x);
}

/** 이 교수법이 쓰이는 모듈들 */
export function modulesOfMethod(methodId: string): { module: Module; application: MethodApplication }[] {
  return (applicationsByMethod.get(methodId) ?? [])
    .map((application) => {
      const module = MODULE_BY_ID.get(application.moduleId);
      return module ? { module, application } : null;
    })
    .filter((x): x is { module: Module; application: MethodApplication } => !!x);
}

/* ───────────────── 조회 헬퍼 ───────────────── */

export const LEVEL_BY_ID = new Map<string, Level>(LEVELS.map((l) => [l.id, l]));
export const MODULE_BY_ID = new Map<string, Module>(MODULES.map((m) => [m.id, m]));
export const TUNE_BY_ID = new Map<string, Tune>(TUNES.map((t) => [t.id, t]));
export const ALBUM_BY_ID = new Map<string, Album>(ALBUMS.map((a) => [a.id, a]));
export const VIDEO_BY_ID = new Map<string, VideoResource>(VIDEOS.map((v) => [v.id, v]));
export const REVIEWER_BY_ID = new Map<string, Reviewer>(FACULTY.map((r) => [r.id, r]));
export const GLOSSARY_BY_ID = new Map<string, GlossaryEntry>(GLOSSARY.map((g) => [g.id, g]));

export function modulesOfLevel(levelId: LevelId): Module[] {
  return MODULES.filter((m) => m.levelId === levelId);
}

export function tunesOfLevel(levelId: LevelId): Tune[] {
  return TUNES.filter((t) => t.levelId === levelId);
}

export function albumsOfLevel(levelId: LevelId): Album[] {
  return ALBUMS.filter((a) => a.levelId === levelId).sort((a, b) => a.priority - b.priority);
}

export function videosOfModule(moduleId: string): VideoResource[] {
  const mod = MODULE_BY_ID.get(moduleId);
  const ids = new Set([...(mod?.videos ?? []), ...(videosByModule.get(moduleId) ?? [])]);
  return [...ids].map((id) => VIDEO_BY_ID.get(id)).filter((v): v is VideoResource => !!v);
}

export function albumsOfModule(moduleId: string): Album[] {
  const mod = MODULE_BY_ID.get(moduleId);
  const ids = new Set([...(mod?.listening ?? []), ...(albumsByModule.get(moduleId) ?? [])]);
  return [...ids].map((id) => ALBUM_BY_ID.get(id)).filter((a): a is Album => !!a);
}

export function tunesOfModule(moduleId: string): Tune[] {
  const mod = MODULE_BY_ID.get(moduleId);
  return (mod?.repertoire ?? []).map((id) => TUNE_BY_ID.get(id)).filter((t): t is Tune => !!t);
}

export function nextModule(moduleId: string): Module | null {
  const i = MODULES.findIndex((m) => m.id === moduleId);
  return i >= 0 && i < MODULES.length - 1 ? MODULES[i + 1] : null;
}

export function prevModule(moduleId: string): Module | null {
  const i = MODULES.findIndex((m) => m.id === moduleId);
  return i > 0 ? MODULES[i - 1] : null;
}

/** 전 커리큘럼의 드릴 평면화 — 세션 생성기와 진도 추적이 쓴다 */
export interface DrillRef extends Drill { moduleId: string; levelId: LevelId; moduleTitle: string }

export const ALL_DRILLS: DrillRef[] = MODULES.flatMap((m) =>
  m.drills.map((d) => ({ ...d, moduleId: m.id, levelId: m.levelId, moduleTitle: m.title })),
);

export const DRILL_BY_ID = new Map<string, DrillRef>(ALL_DRILLS.map((d) => [d.id, d]));

export const DRILL_AXIS_MAP: Record<string, SkillAxis[]> =
  Object.fromEntries(ALL_DRILLS.map((d) => [d.id, d.axis]));

/* ───────────────── 통계 ───────────────── */

export const CONTENT_STATS = {
  levels: LEVELS.length,
  modules: MODULES.length,
  concepts: MODULES.reduce((s, m) => s + m.concepts.length, 0),
  drills: ALL_DRILLS.length,
  tunes: TUNES.length,
  albums: ALBUMS.length,
  videos: VIDEOS.length,
  channels: CHANNELS.length,
  glossary: GLOSSARY.length,
  earDrills: EAR_DRILLS.length,
  totalWeeks: LEVELS.reduce((s, l) => s + l.weeks, 0),
  totalHours: LEVELS.reduce((s, l) => s + l.weeks * l.hoursPerWeek, 0),
  reviewedModules: MODULES.filter((m) => m.review.status !== 'draft').length,
  teachingMethods: TEACHING_METHODS.length,
  methodApplications: METHOD_APPLICATIONS.length,
};

/** 검수 상태 집계 */
export function reviewSummary() {
  const counts: Record<string, number> = {};
  for (const m of MODULES) counts[m.review.status] = (counts[m.review.status] ?? 0) + 1;
  const rubrics = MODULES.map((m) => m.review.rubric).filter((r): r is NonNullable<typeof r> => !!r);
  const avg = (key: keyof NonNullable<Module['review']['rubric']>) =>
    rubrics.length ? rubrics.reduce((s, r) => s + r[key], 0) / rubrics.length : 0;
  return {
    counts,
    averages: {
      accuracy: avg('accuracy'), terminology: avg('terminology'), sequencing: avg('sequencing'),
      playability: avg('playability'), idiom: avg('idiom'), integration: avg('integration'),
      assessability: avg('assessability'), sourcing: avg('sourcing'),
    },
    reviewedCount: rubrics.length,
  };
}
