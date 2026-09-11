/**
 * 콘텐츠 정합성 검사 (QA 게이트)
 * ---------------------------------------------------------------------------
 * 이 테스트가 잡아내야 하는 것:
 *  - 존재하지 않는 id 참조 / 중복 id
 *  - 비어 있는 필수 필드 (개념·드릴·평가·검수기록·출처)
 *  - 선수 모듈 그래프의 순환 참조
 *  - 튠의 마디 수와 선언한 폼의 불일치
 *  - 파싱 불가능한 코드 심볼  ← 모든 곡의 모든 코드가 파서를 통과해야 한다
 *  - 저작권 규칙 위반 (melodyIncluded)
 *  - 정직성 규칙 위반 (isRealPerson)
 */
import { describe, it, expect } from 'vitest';
import {
  LEVELS, MODULES, TUNES, ALBUMS, VIDEOS, CHANNELS, FACULTY, GLOSSARY,
  EAR_DRILLS, PLACEMENT, ALL_DRILLS, MODULE_BY_ID, TUNE_BY_ID, ALBUM_BY_ID,
  VIDEO_BY_ID, REVIEWER_BY_ID,
} from './index';
import { parseChord, parseIntervalName } from '../lib/theory';
import { flattenChart } from '../lib/playalong';

const dupes = (ids: string[]) => ids.filter((id, i) => ids.indexOf(id) !== i);

describe('id 고유성', () => {
  it.each([
    ['레벨', LEVELS.map((x) => x.id)],
    ['모듈', MODULES.map((x) => x.id)],
    ['튠', TUNES.map((x) => x.id)],
    ['앨범', ALBUMS.map((x) => x.id)],
    ['영상', VIDEOS.map((x) => x.id)],
    ['채널', CHANNELS.map((x) => x.id)],
    ['검수자', FACULTY.map((x) => x.id)],
    ['용어', GLOSSARY.map((x) => x.id)],
    ['청음 드릴', EAR_DRILLS.map((x) => x.id)],
    ['배치 문항', PLACEMENT.map((x) => x.id)],
    ['연습 드릴', ALL_DRILLS.map((x) => x.id)],
  ])('%s id 는 중복되지 않는다', (_label, ids) => {
    expect(dupes(ids as string[])).toEqual([]);
  });
});

describe('교차 참조 무결성', () => {
  it('모듈의 levelId 가 실존한다', () => {
    const levelIds = new Set(LEVELS.map((l) => l.id));
    for (const m of MODULES) expect(levelIds.has(m.levelId), `${m.id} → ${m.levelId}`).toBe(true);
  });

  it('모듈이 참조하는 곡·앨범·영상 id 가 실존한다', () => {
    const bad: string[] = [];
    for (const m of MODULES) {
      for (const t of m.repertoire) if (!TUNE_BY_ID.has(t)) bad.push(`${m.id} → tune:${t}`);
      for (const a of m.listening) if (!ALBUM_BY_ID.has(a)) bad.push(`${m.id} → album:${a}`);
      for (const v of m.videos) if (!VIDEO_BY_ID.has(v)) bad.push(`${m.id} → video:${v}`);
    }
    expect(bad).toEqual([]);
  });

  it('모든 relatedModules 가 실존 모듈을 가리킨다', () => {
    const bad: string[] = [];
    const check = (owner: string, ids: string[]) => {
      for (const id of ids) if (!MODULE_BY_ID.has(id)) bad.push(`${owner} → ${id}`);
    };
    for (const a of ALBUMS) {
      check(`album:${a.id}`, a.relatedModules);
      for (const n of a.trackNotes) if (n.moduleId) check(`album:${a.id}/track`, [n.moduleId]);
    }
    for (const v of VIDEOS) check(`video:${v.id}`, v.relatedModules);
    for (const g of GLOSSARY) check(`glossary:${g.id}`, g.relatedModules);
    for (const e of EAR_DRILLS) check(`earDrill:${e.id}`, e.relatedModules);
    expect(bad).toEqual([]);
  });

  it('곡이 참조하는 필청 앨범이 실존한다', () => {
    const bad: string[] = [];
    for (const t of TUNES) for (const a of t.keyRecordings) if (!ALBUM_BY_ID.has(a)) bad.push(`${t.id} → ${a}`);
    expect(bad).toEqual([]);
  });

  it('모든 검수 기록의 검수자가 실존한다', () => {
    const bad: string[] = [];
    const check = (owner: string, ids: string[]) => {
      for (const id of ids) if (!REVIEWER_BY_ID.has(id)) bad.push(`${owner} → ${id}`);
    };
    for (const m of MODULES) {
      check(`module:${m.id}`, m.review.reviewers);
      for (const c of m.review.comments ?? []) check(`module:${m.id}/comment`, [c.reviewerId]);
    }
    for (const t of TUNES) check(`tune:${t.id}`, t.review.reviewers);
    for (const a of ALBUMS) check(`album:${a.id}`, a.review.reviewers);
    expect(bad).toEqual([]);
  });

  it('선수 모듈이 실존하고 순환 참조가 없다', () => {
    const missing: string[] = [];
    for (const m of MODULES) {
      for (const r of m.requires ?? []) if (!MODULE_BY_ID.has(r)) missing.push(`${m.id} → ${r}`);
    }
    expect(missing).toEqual([]);

    const state = new Map<string, 0 | 1 | 2>();
    const cycles: string[] = [];
    const visit = (id: string, path: string[]) => {
      if (state.get(id) === 2) return;
      if (state.get(id) === 1) { cycles.push([...path, id].join(' → ')); return; }
      state.set(id, 1);
      for (const r of MODULE_BY_ID.get(id)?.requires ?? []) visit(r, [...path, id]);
      state.set(id, 2);
    };
    for (const m of MODULES) visit(m.id, []);
    expect(cycles).toEqual([]);
  });
});

describe('모듈 완결성', () => {
  it('모든 모듈이 개념·드릴·목표·평가·검수기록을 갖는다', () => {
    const bad: string[] = [];
    for (const m of MODULES) {
      if (!m.concepts.length) bad.push(`${m.id}: 개념 없음`);
      if (!m.drills.length) bad.push(`${m.id}: 드릴 없음`);
      if (!m.objectives.length) bad.push(`${m.id}: 학습목표 없음`);
      if (!m.assessment.criteria.length) bad.push(`${m.id}: 통과기준 없음`);
      if (!m.assessment.performanceTask) bad.push(`${m.id}: 실기과제 없음`);
      if (!m.review.reviewers.length) bad.push(`${m.id}: 검수자 없음`);
    }
    expect(bad).toEqual([]);
  });

  it('모든 개념에 출처가 붙어 있다', () => {
    const bad: string[] = [];
    for (const m of MODULES) for (const c of m.concepts) {
      if (!c.sources.length) bad.push(`${m.id}/${c.id}`);
    }
    expect(bad).toEqual([]);
  });

  it('통과 기준에 측정 불가능한 표현이 없다', () => {
    const banned = /이해한다|익숙해진다|친숙해진다|느껴본다/;
    const bad: string[] = [];
    for (const m of MODULES) for (const c of m.assessment.criteria) {
      if (banned.test(c)) bad.push(`${m.id}: "${c}"`);
    }
    for (const l of LEVELS) for (const c of l.exitCriteria) {
      if (banned.test(c)) bad.push(`${l.id}: "${c}"`);
    }
    expect(bad).toEqual([]);
  });

  it('모든 예제의 코드 심볼이 파서를 통과한다', () => {
    const bad: string[] = [];
    for (const m of MODULES) for (const c of m.concepts) for (const ex of c.examples ?? []) {
      for (const sym of ex.chords) if (!parseChord(sym)) bad.push(`${m.id}/${c.id}: ${sym}`);
    }
    expect(bad).toEqual([]);
  });

  it('드릴의 랩 링크가 유효한 경로를 가리킨다', () => {
    const valid = /^\/lab\/(keyboard|voicing|progression|ear|metronome)(\?.*)?$/;
    const bad: string[] = [];
    for (const d of ALL_DRILLS) {
      if (d.labLink && !valid.test(d.labLink)) bad.push(`${d.id}: ${d.labLink}`);
    }
    expect(bad).toEqual([]);
  });

  it('드릴의 목표 템포가 시작 템포보다 높다', () => {
    const bad = ALL_DRILLS.filter((d) => d.tempoRange[1] < d.tempoRange[0]).map((d) => d.id);
    expect(bad).toEqual([]);
  });
});

describe('레퍼토리 — 저작권과 형식', () => {
  it('어떤 곡도 멜로디를 포함하지 않는다 (저작권 하드 룰)', () => {
    expect(TUNES.filter((t) => t.melodyIncluded !== false).map((t) => t.id)).toEqual([]);
  });

  it('모든 코드 심볼이 파서를 통과한다', () => {
    const bad: string[] = [];
    for (const t of TUNES) for (const s of t.sections) for (const bar of s.bars) {
      for (const sym of bar.chords) if (!parseChord(sym)) bad.push(`${t.id} [${s.label}]: ${sym}`);
    }
    expect(bad).toEqual([]);
  });

  it('마디 수가 선언한 폼과 일치한다', () => {
    const expected: Record<string, number> = {
      'blues-12': 12, 'minor-blues-12': 12,
      'AABA-32': 32, 'ABAC-32': 32, 'rhythm-changes-32': 32, 'ABA-16': 16,
    };
    const bad: string[] = [];
    for (const t of TUNES) {
      const want = expected[t.form];
      if (!want) continue;
      const got = flattenChart(t.sections, t.meter[0]).length;
      if (got !== want) bad.push(`${t.id} (${t.form}): ${got}마디 ≠ ${want}마디`);
    }
    expect(bad).toEqual([]);
  });

  it('마디 안 박자 분배의 합이 박자표와 같다', () => {
    const bad: string[] = [];
    for (const t of TUNES) for (const s of t.sections) s.bars.forEach((bar, i) => {
      if (!bar.beats) return;
      const sum = bar.beats.reduce((a, b) => a + b, 0);
      if (sum !== t.meter[0]) bad.push(`${t.id} [${s.label}] ${i + 1}마디: ${sum} ≠ ${t.meter[0]}`);
    });
    expect(bad).toEqual([]);
  });

  it('오리지널 연습곡은 Jazzytory 창작물로 표기된다', () => {
    for (const t of TUNES.filter((x) => x.id.startsWith('t-jz-'))) {
      expect(t.publicDomainOrOriginal, t.id).toBe(true);
    }
  });
});

describe('정직성 규칙', () => {
  it('어떤 검수자도 실존 인물로 표기되지 않는다', () => {
    expect(FACULTY.filter((r) => r.isRealPerson !== false).map((r) => r.id)).toEqual([]);
  });

  it('검수자 소속이 실제 대학으로 표기되지 않는다', () => {
    const universities = /버클리|Berklee|줄리아드|Juilliard|뉴스쿨|New School|맨해튼|Manhattan School|서울대|한예종/;
    const bad = FACULTY.filter((r) => universities.test(r.affiliation)).map((r) => r.id);
    expect(bad).toEqual([]);
  });

  it('검증되지 않은 영상은 videoId 를 갖지 않는다 (깨진 임베드 방지)', () => {
    const bad = VIDEOS.filter((v) => v.videoId !== null && !v.verified).map((v) => v.id);
    expect(bad).toEqual([]);
  });

  it('모든 영상이 폴백용 검색어를 갖는다', () => {
    expect(VIDEOS.filter((v) => !v.searchQuery.trim()).map((v) => v.id)).toEqual([]);
  });
});

describe('청음·배치 데이터', () => {
  it('청음 문제 은행의 항목이 모두 재생 가능하다', () => {
    const bad: string[] = [];
    for (const d of EAR_DRILLS) {
      if (!d.bank.length) { bad.push(`${d.id}: 빈 은행`); continue; }
      for (const item of d.bank) {
        if (d.kind === 'interval') {
          const semis = parseIntervalName(item);
          if (semis === null) bad.push(`${d.id}: 인터벌 "${item}"`);
          else if (semis < 0 || semis > 24) bad.push(`${d.id}: 인터벌 "${item}" 음역 밖(${semis}반음)`);
        } else {
          for (const sym of item.split('|')) {
            if (!parseChord(sym.trim())) bad.push(`${d.id}: 코드 "${sym}"`);
          }
        }
      }
    }
    expect(bad).toEqual([]);
  });

  it('객관식 배치 문항은 정답이 정확히 하나다', () => {
    const bad = PLACEMENT.filter((q) => q.kind === 'choice'
      && q.options.filter((o) => o.correct).length !== 1).map((q) => q.id);
    expect(bad).toEqual([]);
  });

  it('자기 보고 문항의 모든 선택지에 점수가 있다', () => {
    const bad = PLACEMENT.filter((q) => q.kind === 'self-report'
      && q.options.some((o) => o.value === undefined)).map((q) => q.id);
    expect(bad).toEqual([]);
  });
});

describe('커리큘럼 커버리지', () => {
  it('모든 레벨에 최소 1개 모듈이 있다', () => {
    const empty = LEVELS.filter((l) => !MODULES.some((m) => m.levelId === l.id)).map((l) => l.id);
    expect(empty).toEqual([]);
  });

  it('레벨당 priority 1 앨범은 3장 이하다', () => {
    const bad: string[] = [];
    for (const l of LEVELS) {
      const n = ALBUMS.filter((a) => a.levelId === l.id && a.priority === 1).length;
      if (n > 3) bad.push(`${l.id}: ${n}장`);
    }
    expect(bad).toEqual([]);
  });

  it('모든 앨범이 최소 하나의 모듈에 연결된다', () => {
    expect(ALBUMS.filter((a) => !a.relatedModules.length).map((a) => a.id)).toEqual([]);
  });
});

