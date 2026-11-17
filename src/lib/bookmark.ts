import { useEffect, useState } from 'react';

/**
 * 책갈피 — 커리큘럼 한 페이지의 「어느 글이든」 한 군데를 꽂아 둔다.
 *
 * 글 블록마다 data-bm 키가 붙어 있다(Curriculum · LecturePlayer).
 *   hero · end            페이지 머리 · 끝
 *   lv:<레벨>  sh:<레벨>  레벨 소개 · 레벨 명반 책장
 *   lec:<모듈>            강의 한 줄(제목 · 요약)
 *   ch:<모듈>:<n>         챕터
 *   ln:<모듈>:<n>         강의 원고 한 문장
 *   al:<모듈>  vd:<모듈>  그 강의의 명반 · 추천 영상
 * 모듈이 붙은 키는 그 강의를 열어야 보이므로 moduleId 를 함께 둔다. label 은 꽂은 자리의 글(앞부분)이다.
 */
export interface Bookmark { key: string; moduleId?: string; label: string; at: string }

const KEY = 'jazzytory:bookmark';
const EVT = 'jazzytory:bookmark';

export function moduleOfKey(key: string): string | undefined {
  const m = /^(?:lec|ch|ln|al|vd):([^:]+)/.exec(key);
  return m ? m[1] : undefined;
}

export function readBookmark(): Bookmark | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null');
    if (!v) return null;
    if (typeof v.key === 'string') return v as Bookmark;
    // 11-17 첫 판(강의 단위 { moduleId }) → 강의 한 줄 키로
    if (typeof v.moduleId === 'string') return { key: `lec:${v.moduleId}`, moduleId: v.moduleId, label: '', at: v.at ?? '' };
    return null;
  } catch { return null; }
}

export function writeBookmark(b: { key: string; label?: string } | null): void {
  try {
    if (b) {
      const v: Bookmark = { key: b.key, moduleId: moduleOfKey(b.key), label: (b.label ?? '').replace(/\s+/g, ' ').trim().slice(0, 80), at: new Date().toISOString() };
      localStorage.setItem(KEY, JSON.stringify(v));
    } else localStorage.removeItem(KEY);
  } catch { /* 프라이빗 모드 — 이 화면에서만 기억한다 */ }
  window.dispatchEvent(new CustomEvent(EVT));
}

/** 어느 컴포넌트에서 바꿔도 모두 같이 바뀐다(같은 탭 · 다른 탭). */
export function useBookmark(): [Bookmark | null, typeof writeBookmark] {
  const [bm, setBm] = useState<Bookmark | null>(() => readBookmark());
  useEffect(() => {
    const sync = () => setBm(readBookmark());
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener('storage', sync); };
  }, []);
  return [bm, writeBookmark];
}

/** 원고 문장에 꽂힌 책갈피로 갈 때 그 강의의 스크립트를 펼치라고 알린다 */
export const OPEN_SCRIPT_EVT = 'jazzytory:open-script';
