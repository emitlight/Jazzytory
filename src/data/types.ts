/**
 * Jazzytory — 공유 콘텐츠 타입 계약 (Content Type Contract)
 * ---------------------------------------------------------------------------
 * 이 파일은 모든 콘텐츠 데이터 모듈(curriculum / tunes / albums / videos /
 * faculty)이 반드시 따라야 하는 단일 진실 공급원(Single Source of Truth)이다.
 * 콘텐츠 제작 에이전트는 이 파일을 import 하여 `satisfies` 로 검증한다.
 *
 * 편집 규칙
 *  - 필드 추가는 가능하되 기존 필드의 의미/이름은 바꾸지 않는다.
 *  - 모든 id 는 kebab-case, 전역 유일.
 *  - 사용자 노출 문자열은 한국어를 기본으로 하고 영문 원어는 *En 필드에 둔다.
 */

/* ─────────────────────────────  공통  ───────────────────────────── */

/** 학습 단계. L0(진단) ~ L8(자기 언어) */
export type LevelId =
  | 'L0' | 'L1' | 'L2' | 'L3' | 'L4' | 'L5' | 'L6' | 'L7' | 'L8';

/** 음악적 역량 축 — 진도/숙련도 레이더 차트의 축이 된다. */
export type SkillAxis =
  | 'harmony'      // 화성 이해
  | 'voicing'      // 보이싱/컴핑
  | 'melody'       // 선율/즉흥 어휘
  | 'rhythm'       // 리듬/타임/스윙
  | 'ear'          // 청음
  | 'repertoire'   // 레퍼토리
  | 'technique'    // 테크닉
  | 'form';        // 폼/구조 감각

export const SKILL_AXES: SkillAxis[] = [
  'harmony', 'voicing', 'melody', 'rhythm', 'ear', 'repertoire', 'technique', 'form',
];

export const SKILL_AXIS_LABEL: Record<SkillAxis, string> = {
  harmony: '화성', voicing: '보이싱', melody: '선율', rhythm: '리듬',
  ear: '청음', repertoire: '레퍼토리', technique: '테크닉', form: '폼',
};

/** 출처 인용. 모든 이론 주장에는 최소 1개의 출처가 붙어야 한다. */
export interface SourceRef {
  /** 예: "Mulholland & Hojnacki, *The Berklee Book of Jazz Harmony* (Berklee Press, 2013), ch.4" */
  citation: string;
  /** 해당 주장이 교재의 어느 개념에 대응하는지 */
  note?: string;
}

/* ─────────────────────────  검수(Editorial Review)  ───────────────────────── */

export type ReviewStatus =
  | 'draft'              // 집필 완료, 미검수
  | 'internal-reviewed'  // 내부 이론 검수 통과
  | 'faculty-pending'    // 외부 교수 검수 요청됨
  | 'faculty-approved'   // 외부 교수 검수 승인
  | 'revision-required'; // 수정 요청

export const REVIEW_STATUS_LABEL: Record<ReviewStatus, string> = {
  'draft': '초안',
  'internal-reviewed': '내부 검수 완료',
  'faculty-pending': '외부 검수 대기',
  'faculty-approved': '교수 검수 승인',
  'revision-required': '수정 요청',
};

/** 검수 루브릭 8개 항목 (docs/04-REVIEW-PROTOCOL.md 참조) */
export interface ReviewRubricScore {
  /** 이론적 정확성 */ accuracy: number;
  /** 용어 표준성 (버클리/통용 표기) */ terminology: number;
  /** 난이도 계열성 (선수학습 정합) */ sequencing: number;
  /** 연주 실현 가능성 (건반에서 실제로 되는가) */ playability: number;
  /** 스타일 진정성 (재즈 관용구로서 맞는가) */ idiom: number;
  /** 청음/레퍼토리 연계 */ integration: number;
  /** 평가 가능성 (측정 가능한 목표인가) */ assessability: number;
  /** 출처 신뢰성 */ sourcing: number;
}

export interface ReviewRecord {
  status: ReviewStatus;
  /** 검수자 id 목록 (faculty.ts 의 Reviewer.id) */
  reviewers: string[];
  /** ISO date */
  reviewedAt?: string;
  rubric?: ReviewRubricScore;
  /** 검수 의견 — 실제로 콘텐츠에 반영된 코멘트 */
  comments?: ReviewComment[];
}

export interface ReviewComment {
  reviewerId: string;
  /** 지적 사항 */
  issue: string;
  /** 반영 내용 */
  resolution: string;
  severity: 'blocker' | 'major' | 'minor' | 'suggestion';
}

export interface Reviewer {
  id: string;
  name: string;
  /** 소속·직함. 실존 인물을 사칭하지 않는다. */
  affiliation: string;
  /** 검수 담당 영역 */
  scope: string[];
  /** 이 검수자가 어떤 기준·교재 계열을 대표하는가 */
  lineage: string;
  bio: string;
  /** 실존 인물 여부. Jazzytory 편집부는 실존 인물을 사칭하지 않으므로 항상 false. */
  isRealPerson: false;
}

/* ─────────────────────────────  커리큘럼  ───────────────────────────── */

export interface Level {
  id: LevelId;
  /** 예: 1 */
  order: number;
  title: string;
  titleEn: string;
  /** 한 줄 약속: 이 레벨을 마치면 무엇이 되는가 */
  promise: string;
  description: string;
  /** 예상 소요 주 */
  weeks: number;
  /** 주당 권장 연습 시간 */
  hoursPerWeek: number;
  /** 대응하는 대학 과정 학기 표기 */
  collegeEquivalent: string;
  /** 버클리 계열 코스 코드/과목명 대응 */
  berkleeAlignment: string[];
  /** 레벨 진입 요건 (사람이 읽는 문장) */
  prerequisites: string[];
  /** 수료 기준 — 주리(jury) 심사 항목 */
  exitCriteria: string[];
  /** 축별 목표 숙련도 0~100 */
  targetSkills: Partial<Record<SkillAxis, number>>;
  accentColor: string;
}

export interface Concept {
  id: string;
  title: string;
  titleEn?: string;
  /** 본문. 문단은 \n\n 로 분리. 제한적 마크다운(**굵게**, `코드`, - 목록) 지원 */
  body: string;
  /** 건반/보이싱 예시 — lib/theory 로 렌더된다 */
  examples?: ConceptExample[];
  /** 흔한 오류와 교정 */
  pitfalls?: string[];
  sources: SourceRef[];
}

export interface ConceptExample {
  label: string;
  /** 코드 심볼 진행. 예: ["D-7","G7","C∆7"] */
  chords: string[];
  /** 기준 조 (없으면 C) */
  key?: string;
  /** 어떤 보이싱으로 보여줄지 */
  voicing?: VoicingStyleId;
  caption?: string;
}

export type VoicingStyleId =
  | 'shell-a'        // 1-3-7
  | 'shell-b'        // 1-7-3
  | 'guide-tones'    // 3-7 only
  | 'rootless-a'     // 3-5-7-9
  | 'rootless-b'     // 7-9-3-5
  | 'drop2'
  | 'quartal'        // So What
  | 'upper-structure'
  | 'block'          // 4-way close / locked hands
  | 'spread';        // 양손 확장

export interface Drill {
  id: string;
  title: string;
  /** 무엇을, 어떻게 */
  instruction: string;
  /** 12키 순환 여부 */
  allKeys: boolean;
  /** 목표 템포 (BPM) — [시작, 목표] */
  tempoRange: [number, number];
  /** 권장 반복 일수 */
  days: number;
  axis: SkillAxis[];
  /** 인터랙티브 랩 딥링크 (예: "/lab/voicing?style=rootless-a&prog=ii-V-I") */
  labLink?: string;
}

export interface ModuleAssessment {
  /** 이 모듈 통과 조건 */
  criteria: string[];
  /** 자가 점검 질문 */
  selfCheck: string[];
  /** 실기 과제 */
  performanceTask: string;
}

export interface Module {
  id: string;
  levelId: LevelId;
  order: number;
  title: string;
  titleEn: string;
  summary: string;
  /** 측정 가능한 학습 목표 (Bloom 동사 사용) */
  objectives: string[];
  estMinutes: number;
  axis: SkillAxis[];
  concepts: Concept[];
  drills: Drill[];
  /** tunes.ts 의 Tune.id */
  repertoire: string[];
  /** albums.ts 의 Album.id */
  listening: string[];
  /** videos.ts 의 VideoResource.id */
  videos: string[];
  assessment: ModuleAssessment;
  review: ReviewRecord;
  /** 선수 모듈 id */
  requires?: string[];
}

/* ─────────────────────────────  레퍼토리  ───────────────────────────── */

export type TuneForm =
  | 'AABA-32' | 'ABAC-32' | 'blues-12' | 'minor-blues-12' | 'rhythm-changes-32'
  | 'ABA-16' | 'modal' | 'through-composed' | 'AAB' | 'other';

export type TuneStyle =
  | 'swing' | 'ballad' | 'bossa' | 'samba' | 'latin' | 'modal'
  | 'blues' | 'bebop' | 'waltz' | 'funk' | 'free';

/** 한 마디. 마디 안의 코드들 — 대부분 1~2개. */
export interface Bar {
  /** 코드 심볼 배열. 빈 배열이면 앞 코드 연장(%) */
  chords: string[];
  /** 각 코드가 차지하는 박 (합이 박자와 같아야 함). 생략 시 균등 분할 */
  beats?: number[];
  /** 리허설 마크 */
  section?: string;
  /** 마디 시작 반복 기호 */
  repeatStart?: boolean;
  repeatEnd?: boolean;
  /** 1st/2nd ending */
  ending?: 1 | 2;
  /** 코다/세뇨 */
  marker?: 'segno' | 'coda' | 'tocoda' | 'fine';
}

export interface TuneSection {
  /** A, B, A', C, Intro, Coda ... */
  label: string;
  bars: Bar[];
}

export interface Tune {
  id: string;
  title: string;
  composer: string;
  year?: number;
  /** 조표 (예: "F", "Bb", "C-") */
  key: string;
  /** [분자, 분모] */
  meter: [number, number];
  form: TuneForm;
  style: TuneStyle;
  /** 권장 템포 범위 */
  tempo: [number, number];
  /** 난이도 1~5 */
  difficulty: 1 | 2 | 3 | 4 | 5;
  /** 최초 학습 권장 레벨 */
  levelId: LevelId;
  sections: TuneSection[];
  /** 이 곡으로 배우는 것 */
  teaches: string[];
  /** 연주 가이드 — 어떻게 접근할 것인가 */
  approach: string;
  /** 어려운 구간과 해법 */
  hotspots?: { at: string; issue: string; solution: string }[];
  /** 필청 레코딩 — albums.ts 의 Album.id */
  keyRecordings: string[];
  /** 저작권 안내: 이 데이터는 코드 진행(화성 골격)만 담으며 멜로디를 포함하지 않는다. */
  melodyIncluded: false;
  /** 퍼블릭 도메인 또는 Jazzytory 오리지널 여부 */
  publicDomainOrOriginal: boolean;
  review: ReviewRecord;
}

/* ─────────────────────────────  청음 (명반)  ───────────────────────────── */

export interface AlbumTrackNote {
  track: string;
  /** 몇 분쯤 / 어느 코러스 */
  at?: string;
  /** 무엇을 들어야 하는가 — 구체적 청취 지시 */
  listenFor: string;
  /** 이 트랙과 연결된 커리큘럼 모듈 id */
  moduleId?: string;
}

export interface Album {
  id: string;
  title: string;
  leader: string;
  /** 피아니스트 (리더와 다를 수 있음) */
  pianist: string;
  year: number;
  label?: string;
  /** 왜 필청인가 — 한 문단 */
  why: string;
  /** 이 앨범이 대표하는 어법 */
  tags: string[];
  /** 권장 레벨 */
  levelId: LevelId;
  /** 우선순위 1(최우선) ~ 3 */
  priority: 1 | 2 | 3;
  trackNotes: AlbumTrackNote[];
  /** 관련 모듈 */
  relatedModules: string[];
  review: ReviewRecord;
}

/* ─────────────────────────────  영상 자료  ───────────────────────────── */

/**
 * 영상 정책
 *  - Jazzytory 는 **검증되지 않은 videoId 를 임베드하지 않는다.**
 *  - `videoId` 가 있고 `verified: true` 인 항목만 iframe 으로 임베드된다.
 *  - 그 외에는 채널 + 정밀 검색어로 만든 딥링크 카드로 렌더링된다.
 *  - `npm run verify:media` 가 oEmbed 로 생존 여부를 확인해 verified 를 갱신한다.
 */
export interface VideoResource {
  id: string;
  /** 한국어 표시 제목 (원제와 다를 수 있음) */
  title: string;
  /** 채널명 */
  channel: string;
  /** 임베드용 11자 YouTube ID. 미검증이면 null */
  videoId: string | null;
  /** verify:media 스크립트가 갱신. true 일 때만 임베드 */
  verified: boolean;
  /** videoId 가 없을 때 사용할 정밀 검색어 */
  searchQuery: string;
  /** 무엇을 얻어가야 하는가 */
  takeaway: string;
  /** 시청 전 알아야 할 선수 개념 */
  prereq?: string;
  minutes?: number;
  lang: 'ko' | 'en';
  relatedModules: string[];
}

export interface Channel {
  id: string;
  name: string;
  handle?: string;
  focus: string;
  level: string;
  lang: 'ko' | 'en';
}

/* ─────────────────────────────  청음 훈련  ───────────────────────────── */

export interface EarDrillSpec {
  id: string;
  title: string;
  kind: 'interval' | 'chord-quality' | 'progression' | 'guide-tone' | 'bass-motion';
  levelId: LevelId;
  description: string;
  /** 문제 은행 — 각 항목은 코드 심볼/인터벌 이름 */
  bank: string[];
  relatedModules: string[];
}

/* ─────────────────────────────  용어집  ───────────────────────────── */

export interface GlossaryEntry {
  id: string;
  term: string;
  termEn: string;
  /** 자주 쓰이는 다른 표기 */
  aka?: string[];
  definition: string;
  example?: string;
  relatedModules: string[];
}

/* ─────────────────────────────  진단 평가  ───────────────────────────── */

export interface PlacementQuestion {
  id: string;
  axis: SkillAxis;
  /** 이 문항을 맞히면 도달한 것으로 보는 레벨 */
  signals: LevelId;
  prompt: string;
  kind: 'choice' | 'self-report';
  options: { label: string; correct?: boolean; value?: number }[];
  explanation: string;
}
