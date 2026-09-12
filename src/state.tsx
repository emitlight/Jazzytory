import { createContext, useContext, useEffect, useMemo, useState, useCallback, type ReactNode } from 'react';
import { loadState, saveState, type UserState, DEFAULT_STATE, logPractice } from './lib/storage';
import { recordAttempt, type DrillAttempt, todayISO } from './lib/mastery';

interface Ctx {
  state: UserState;
  update: (fn: (s: UserState) => UserState) => void;
  /** targetBpm 과 title 은 호출부가 넘긴다 — 루트 번들이 콘텐츠 전체를 끌어오지 않도록. */
  logDrill: (drill: { id: string; title: string; targetBpm: number }, bpm: number, clean: boolean, minutes: number) => void;
  logSession: (minutes: number, what: string, note?: string) => void;
  toggleModuleComplete: (moduleId: string) => void;
  toggleFavoriteTune: (tuneId: string) => void;
  toggleListened: (albumId: string) => void;
  reset: () => void;
}

const AppCtx = createContext<Ctx | null>(null);

export function AppProvider({ children }: { children: ReactNode }) {
  const [state, setState] = useState<UserState>(() => loadState());

  useEffect(() => { saveState(state); }, [state]);

  // 테마 적용
  useEffect(() => {
    const t = state.settings.theme;
    const root = document.documentElement;
    if (t === 'system') root.removeAttribute('data-theme');
    else root.setAttribute('data-theme', t);
  }, [state.settings.theme]);

  const update = useCallback((fn: (s: UserState) => UserState) => setState(fn), []);

  const logDrill = useCallback((drill: { id: string; title: string; targetBpm: number }, bpm: number, clean: boolean, minutes: number) => {
    const attempt: DrillAttempt = { drillId: drill.id, date: todayISO(), bpm, clean, minutes };
    setState((s) => {
      const next = recordAttempt(s.drills[drill.id], attempt, drill.targetBpm);
      return logPractice({ ...s, drills: { ...s.drills, [drill.id]: next } }, minutes, drill.title);
    });
  }, []);

  const logSession = useCallback((minutes: number, what: string, note?: string) => {
    setState((s) => logPractice(s, minutes, what, note));
  }, []);

  const toggleModuleComplete = useCallback((moduleId: string) => {
    setState((s) => ({
      ...s,
      completedModules: s.completedModules.includes(moduleId)
        ? s.completedModules.filter((m) => m !== moduleId)
        : [...s.completedModules, moduleId],
    }));
  }, []);

  const toggleFavoriteTune = useCallback((tuneId: string) => {
    setState((s) => ({
      ...s,
      favoriteTunes: s.favoriteTunes.includes(tuneId)
        ? s.favoriteTunes.filter((t) => t !== tuneId)
        : [...s.favoriteTunes, tuneId],
    }));
  }, []);

  const toggleListened = useCallback((albumId: string) => {
    setState((s) => ({
      ...s,
      listened: s.listened.includes(albumId)
        ? s.listened.filter((a) => a !== albumId)
        : [...s.listened, albumId],
    }));
  }, []);

  const reset = useCallback(() => setState({ ...DEFAULT_STATE }), []);

  const value = useMemo<Ctx>(
    () => ({ state, update, logDrill, logSession, toggleModuleComplete, toggleFavoriteTune, toggleListened, reset }),
    [state, update, logDrill, logSession, toggleModuleComplete, toggleFavoriteTune, toggleListened, reset],
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
}

export function useApp(): Ctx {
  const ctx = useContext(AppCtx);
  if (!ctx) throw new Error('useApp 은 AppProvider 안에서만 쓸 수 있습니다.');
  return ctx;
}
