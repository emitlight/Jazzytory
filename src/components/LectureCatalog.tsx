import { useEffect, useMemo, useRef, useState, type KeyboardEvent } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { LEVELS, lessonsOfCourse, type Lesson } from '../data';
import type { Level } from '../data/types';
import { LECTURES, lectureOfModule, formatTime, type Lecture } from '../data/lectures';
import { useApp } from '../state';
import { ALL_LEVELS, isValidPick, readStoredLevel, resolveInitialLevel, writeStoredLevel, type LevelPick } from '../lib/lectureLevel';

interface Group { level: Level; published: { lesson: Lesson; lec: Lecture }[]; pending: Lesson[] }

const URL_KEY = 'level';
const sectionId = (levelId: string) => `lecture-level-${levelId}`;

/**
 * 오리지널 강의 목록 — 레벨 L0→L8 순, 레벨 안에서는 커리큘럼(차시) 순서.
 * 강의가 아직 없는 차시는 "곧 게시" 로 접어 두어 51차시 로드맵이 보이되 스크롤을 늘리지 않는다.
 * 위에 붙는 레벨 칩 바(sticky)로 한 레벨만 골라 본다 — 폰에서 전 레벨을 내려 보는 피로를 없애기 위한 것.
 * 첫 화면(간단 보기)·자료실 「강의」 탭·자료실 「영상」 탭이 같은 컴포넌트를 쓴다.
 */
export default function LectureCatalog({ upcoming = true }: { upcoming?: boolean }) {
  const { state } = useApp();
  const [searchParams, setSearchParams] = useSearchParams();
  const rootRef = useRef<HTMLDivElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const scrollAfterPick = useRef(false);
  const [expanded, setExpanded] = useState<Record<string, boolean>>({});

  const groups = useMemo<Group[]>(() => LEVELS.map((level) => {
    const lessons = lessonsOfCourse(level.id);
    const published = lessons.flatMap((l) => {
      const lec = lectureOfModule(l.module.id);
      return lec ? [{ lesson: l, lec }] : [];
    });
    const pending = upcoming ? lessons.filter((l) => !lectureOfModule(l.module.id)) : [];
    return { level, published, pending };
  }).filter((g) => g.published.length > 0 || upcoming), [upcoming]);

  const levelIds = groups.map((g) => g.level.id);
  const urlLevel = searchParams.get(URL_KEY);
  const pick: LevelPick = resolveInitialLevel(
    urlLevel,
    readStoredLevel(),
    groups.map((g) => ({ id: g.level.id, publishedCount: g.published.length })),
  );

  const select = (next: LevelPick) => {
    writeStoredLevel(next);
    scrollAfterPick.current = true;
    setSearchParams((prev) => {
      const sp = new URLSearchParams(prev);
      sp.set(URL_KEY, next);
      return sp;
    }, { replace: true });
  };

  // 칩을 눌러 바뀐 뒤 — 목록 머리가 고정 바 위로 올라가 있으면 바 바로 아래로 끌어온다 (전체 → 레벨 "점프")
  useEffect(() => {
    if (!scrollAfterPick.current) return;
    scrollAfterPick.current = false;
    const root = rootRef.current;
    if (!root) return;
    const topbarH = document.querySelector<HTMLElement>('.topbar')?.getBoundingClientRect().height ?? 0;
    const barH = barRef.current?.getBoundingClientRect().height ?? 0;
    const offset = topbarH + barH + 8;
    const target = pick === ALL_LEVELS ? root : document.getElementById(sectionId(pick)) ?? root;
    const top = target.getBoundingClientRect().top;
    // 목록이 통째로 바뀌므로 즉시 이동한다. WebKit 의 스크롤 앵커링이 먼저 위치를 옮겨 놓아도 이 effect 가 그 뒤에 돈다
    if (Math.abs(top - offset) > 2) window.scrollTo({ top: Math.max(0, top + window.scrollY - offset) });
  }, [pick]);

  // 선택된 칩이 바 밖에 있으면 가로로만 끌어와 보이게 한다 (세로 스크롤은 건드리지 않는다)
  useEffect(() => {
    const bar = barRef.current;
    const chip = bar?.querySelector<HTMLElement>('[aria-checked="true"]');
    if (!bar || !chip) return;
    const left = chip.offsetLeft - 12;
    const right = chip.offsetLeft + chip.offsetWidth + 12;
    if (left < bar.scrollLeft) bar.scrollTo({ left, behavior: 'smooth' });
    else if (right > bar.scrollLeft + bar.clientWidth) bar.scrollTo({ left: right - bar.clientWidth, behavior: 'smooth' });
  }, [pick]);

  const onBarKey = (e: KeyboardEvent<HTMLDivElement>) => {
    const order: LevelPick[] = [ALL_LEVELS, ...levelIds];
    const i = order.indexOf(pick);
    let next: LevelPick | null = null;
    if (e.key === 'ArrowRight' || e.key === 'ArrowDown') next = order[(i + 1) % order.length];
    else if (e.key === 'ArrowLeft' || e.key === 'ArrowUp') next = order[(i - 1 + order.length) % order.length];
    else if (e.key === 'Home') next = order[0];
    else if (e.key === 'End') next = order[order.length - 1];
    if (!next) return;
    e.preventDefault();
    select(next);
    requestAnimationFrame(() => barRef.current?.querySelector<HTMLElement>('[aria-checked="true"]')?.focus());
  };

  const totalPublished = groups.reduce((n, g) => n + g.published.length, 0);
  const totalAll = groups.reduce((n, g) => n + g.published.length + g.pending.length, 0);
  const visible = pick === ALL_LEVELS ? groups : groups.filter((g) => g.level.id === pick);
  const toggle = (id: string) => setExpanded((m) => ({ ...m, [id]: !m[id] }));

  return (
    <div ref={rootRef} className="stack stack-16 lecture-catalog">
      <div ref={barRef} className="lvl-bar" role="radiogroup" aria-label="레벨 필터" onKeyDown={onBarKey}>
        <LevelChip
          id={ALL_LEVELS} label="전체" title={null} count={`${totalPublished}/${totalAll}`}
          checked={pick === ALL_LEVELS} empty={false} onSelect={select}
        />
        {groups.map(({ level, published, pending }) => (
          <LevelChip
            key={level.id} id={level.id} label={level.id} title={level.title}
            count={`${published.length}/${published.length + pending.length}`}
            checked={pick === level.id} empty={published.length === 0} color={level.accentColor} onSelect={select}
          />
        ))}
      </div>

      {visible.length === 0 && isValidPick(pick, levelIds) && (
        <p className="muted small" style={{ margin: 0 }}>이 레벨에는 아직 강의가 없습니다.</p>
      )}

      <div className="stack stack-24">
        {visible.map((g) => {
          const { level, published, pending } = g;
          const total = published.length + pending.length;
          const open = !!expanded[level.id];
          const single = pick !== ALL_LEVELS;
          return (
            <section key={level.id} id={sectionId(level.id)} className="stack stack-8 lvl-section" aria-label={`${level.id} ${level.title}`}>
              {single ? (
                <div className="row lvl-head" style={{ gap: 8 }}>
                  <span className="level-dot" style={{ background: level.accentColor }} aria-hidden="true" />
                  <span className="eyebrow">{level.id} {level.title}</span>
                  <span className="tiny muted">{published.length}/{total}편</span>
                </div>
              ) : (
                <button
                  type="button" className="lvl-head lvl-head-btn" onClick={() => select(level.id)}
                  aria-label={`${level.id} ${level.title} — 이 레벨만 보기`}
                >
                  <span className="level-dot" style={{ background: level.accentColor }} aria-hidden="true" />
                  <span className="eyebrow">{level.id} {level.title}</span>
                  <span className="tiny muted">{published.length}/{total}편</span>
                  <span className="tiny lvl-only">이 레벨만 보기 ›</span>
                </button>
              )}

              {published.length > 0 ? (
                <div className="lecture-grid">
                  {published.map(({ lesson, lec }) => {
                    const watched = state.watchedLectures.includes(lec.id);
                    return (
                      <article key={lec.id} className="card card-tight stack stack-8">
                        <Link to={lesson.path} className="lecture-thumb" aria-label={`${lec.title} 보기`}>
                          <img src={lec.poster} alt="" loading="lazy" decoding="async" width={640} height={360} />
                          <span className="badge tiny mono">{formatTime(lec.durationSec)}</span>
                        </Link>
                        <Link to={lesson.path} className="small lecture-title" style={{ fontWeight: 700, color: 'var(--text)', textDecoration: 'none' }}>
                          {lec.title}
                        </Link>
                        <div className="row" style={{ gap: 6 }}>
                          <span className="tiny muted">{lesson.number}차시</span>
                          {watched && <span className="badge badge-ok tiny">✓ 시청 완료</span>}
                        </div>
                      </article>
                    );
                  })}
                </div>
              ) : (
                <p className="tiny muted" style={{ margin: 0 }}>아직 게시된 강의가 없습니다.</p>
              )}

              {pending.length > 0 && (
                <div className="stack stack-8">
                  <button
                    type="button" className="btn btn-sm btn-ghost lvl-pending-toggle"
                    aria-expanded={open} aria-controls={`${sectionId(level.id)}-pending`}
                    onClick={() => toggle(level.id)}
                  >
                    <span aria-hidden="true">{open ? '▾' : '▸'}</span>
                    {open ? `곧 게시 ${pending.length}편 접기` : `곧 게시 ${pending.length}편 보기`}
                  </button>
                  {open && (
                    <ul id={`${sectionId(level.id)}-pending`} className="lecture-upcoming" aria-label="곧 게시될 강의">
                      {pending.map((l) => (
                        <li key={l.module.id}>
                          <Link to={l.path}>
                            <span className="mono tiny">{String(l.number).padStart(2, '0')}</span>
                            <span className="small">{l.module.title}</span>
                            <span className="badge tiny">곧 게시</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </div>
              )}
            </section>
          );
        })}
      </div>
      {LECTURES.length === 0 && <p className="muted small">아직 게시된 강의가 없습니다.</p>}
    </div>
  );
}

function LevelChip({ id, label, title, count, checked, empty, color, onSelect }: {
  id: LevelPick; label: string; title: string | null; count: string;
  checked: boolean; empty: boolean; color?: string; onSelect: (id: LevelPick) => void;
}) {
  return (
    <button
      type="button" role="radio" aria-checked={checked} tabIndex={checked ? 0 : -1}
      className={`lvl-chip${checked ? ' active' : ''}${empty ? ' empty' : ''}`}
      onClick={() => onSelect(id)}
    >
      {color && <span className="level-dot" style={{ background: color }} aria-hidden="true" />}
      <span className="lvl-chip-id">{label}</span>
      {title && <span className="lvl-chip-title">{title}</span>}
      <span className="lvl-chip-count mono" aria-label={`게시 ${count}`}>{count}</span>
    </button>
  );
}
