/**
 * Jazzytory 오리지널 강의 — 모듈마다 하나씩 붙는 내레이션 강의 영상.
 * 영상 파일은 별도 정적 호스트에 있고, 여기에는 메타데이터만 둔다(lectures.json).
 * 배열이 비어 있으면 화면에서 강의 영역이 통째로 사라진다.
 */
import raw from './lectures.json';

export interface LectureChapter { t: number; title: string }          // 초
export interface LectureLine { t: number; text: string }              // 자막 문장 시작 시각(초)
export interface Lecture {
  id: string;            // 예: "lec-m-l1-01-chord-symbols"
  moduleId: string;      // modules.*.ts 의 Module.id
  title: string;
  summary: string;
  src: string;           // mp4 의 절대 https URL
  poster: string;        // 16:9 jpg 의 절대 https URL
  durationSec: number;
  chapters: LectureChapter[];
  transcript: LectureLine[];
  publishedAt: string;   // ISO 날짜
  version: number;
}

// 빈 배열 JSON 은 never[] 로 추론되므로 한 번 넓힌다
export const LECTURES: Lecture[] = raw as unknown as Lecture[];

const BY_MODULE = new Map<string, Lecture>(LECTURES.map((l) => [l.moduleId, l]));

export function lectureOfModule(moduleId: string): Lecture | undefined {
  return BY_MODULE.get(moduleId);
}

/** 1:05 / 1:02:03 */
export function formatTime(sec: number): string {
  const s = Math.max(0, Math.floor(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const ss = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${ss}` : `${m}:${ss}`;
}

/**
 * 데이터 계약 검사 — 테스트와 콘텐츠 작업자가 같은 규칙을 본다.
 * 문제 목록을 돌려준다(빈 배열이면 통과).
 */
export function lectureProblems(lectures: Lecture[], moduleIds: Set<string>): string[] {
  const out: string[] = [];
  const ids = new Set<string>();
  const mods = new Set<string>();
  const sorted = (ts: number[]) => ts.every((t, i) => i === 0 || t > ts[i - 1]);
  for (const l of lectures) {
    const at = l.id || '(id 없음)';
    if (!l.id) out.push(`${at}: id 가 비어 있다`);
    if (ids.has(l.id)) out.push(`${at}: id 중복`);
    ids.add(l.id);
    if (!moduleIds.has(l.moduleId)) out.push(`${at}: 없는 모듈 ${l.moduleId}`);
    if (mods.has(l.moduleId)) out.push(`${at}: 모듈 ${l.moduleId} 에 강의가 둘 이상`);
    mods.add(l.moduleId);
    if (!l.title?.trim()) out.push(`${at}: title 이 비어 있다`);
    if (!/^https:\/\//.test(l.src)) out.push(`${at}: src 는 https 절대 URL 이어야 한다`);
    if (!/^https:\/\//.test(l.poster)) out.push(`${at}: poster 는 https 절대 URL 이어야 한다`);
    if (!(l.durationSec > 0)) out.push(`${at}: durationSec 가 0 이하`);
    if (!Number.isInteger(l.version) || l.version < 1) out.push(`${at}: version 은 1 이상의 정수`);
    if (Number.isNaN(Date.parse(l.publishedAt))) out.push(`${at}: publishedAt 이 ISO 날짜가 아니다`);
    for (const [name, list] of [['chapters', l.chapters], ['transcript', l.transcript]] as const) {
      if (!Array.isArray(list)) { out.push(`${at}: ${name} 가 배열이 아니다`); continue; }
      const ts = list.map((x) => x.t);
      if (!sorted(ts)) out.push(`${at}: ${name} 시각이 오름차순이 아니다`);
      if (ts.some((t) => t < 0 || t > l.durationSec)) out.push(`${at}: ${name} 시각이 영상 길이를 벗어난다`);
    }
  }
  return out;
}
