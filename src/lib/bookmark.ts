import { useEffect, useState } from 'react';

/**
 * 책갈피 — 커리큘럼 한 페이지에서 「여기까지 했다」를 한 군데 꽂아 둔다.
 * 강의 하나(moduleId)만 기억한다. 영상 안의 시각은 플레이어의 이어보기 위치가 따로 기억하므로
 * 책갈피로 가면 그 강의가 열리고 보던 곳부터 이어진다.
 */
export interface Bookmark { moduleId: string; at: string }

const KEY = 'jazzytory:bookmark';
const EVT = 'jazzytory:bookmark';

export function readBookmark(): Bookmark | null {
  try {
    const v = JSON.parse(localStorage.getItem(KEY) || 'null');
    return v && typeof v.moduleId === 'string' ? v : null;
  } catch { return null; }
}

export function writeBookmark(moduleId: string | null): void {
  try {
    if (moduleId) localStorage.setItem(KEY, JSON.stringify({ moduleId, at: new Date().toISOString() }));
    else localStorage.removeItem(KEY);
  } catch { /* 프라이빗 모드 — 이 화면에서만 기억한다 */ }
  window.dispatchEvent(new CustomEvent(EVT, { detail: moduleId }));
}

/** 어느 컴포넌트에서 바꿔도 모두 같이 바뀐다(같은 탭 · 다른 탭). */
export function useBookmark(): [Bookmark | null, (moduleId: string | null) => void] {
  const [bm, setBm] = useState<Bookmark | null>(() => readBookmark());
  useEffect(() => {
    const sync = () => setBm(readBookmark());
    window.addEventListener(EVT, sync);
    window.addEventListener('storage', sync);
    return () => { window.removeEventListener(EVT, sync); window.removeEventListener('storage', sync); };
  }, []);
  return [bm, writeBookmark];
}
