import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom';
import { LEVELS, ALL_LESSONS, lessonsOfCourse, albumsOfModule, albumsOfLevel, videosOfModule } from '../data';
import type { LevelId } from '../data/types';
import { lectureOfModule, formatTime, LECTURES } from '../data/lectures';
import { useApp } from '../state';
import { useBookmark, OPEN_SCRIPT_EVT, type Bookmark } from '../lib/bookmark';
import LecturePlayer from '../components/LecturePlayer';
import VideoCard from '../components/VideoCard';
import AlbumShelf from '../components/AlbumShelf';
import { RichText } from '../components/Prose';

const levelAnchor = (id: string) => `lv-${id}`;
const itemAnchor = (moduleId: string) => `lec-${moduleId}`;
const sel = (key: string) => `[data-bm="${CSS.escape(key)}"]`;
/** 책갈피로 가는 중인 키 — 경로가 바뀌며 화면이 다시 그려져도 이어지도록 모듈에 둔다 */
let PENDING: string | null = null;

/** 화면 위 고정 띠(상단 바 + 레벨 레일) 아래로 맞춰 스크롤한다 */
function scrollToId(id: string, smooth = true) {
  document.getElementById(id)?.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
}

/** 꽂은 자리의 글 — 원고 문장 앞의 「0:12」 같은 시각은 뺀다 */
function labelOf(el: Element): string {
  return ((el as HTMLElement).innerText || el.textContent || '').replace(/^\s*\d{1,2}:\d{2}(?::\d{2})?\s*/, '').replace(/\s+/g, ' ').trim();
}

function levelOfBookmark(b: Bookmark | null): string | null {
  if (!b) return null;
  if (b.moduleId) return ALL_LESSONS.find((l) => l.module.id === b.moduleId)?.module.levelId ?? null;
  const m = /^(?:lv|sh):(.+)$/.exec(b.key);
  return m ? m[1] : null;
}

/**
 * 커리큘럼 — L0 부터 L8 까지 51편을 한 페이지에 세로로 편다.
 * 강의를 누르면 그 자리에서 영상 · 원고 · 그 강의의 명반 · 추천 영상이 펼쳐진다.
 * 책갈피는 이 페이지의 어느 글에든 꽂는다(레벨 소개 · 강의 요약 · 챕터 · 원고 한 문장 …).
 */
export default function Curriculum() {
  const { moduleId, levelId } = useParams();
  const location = useLocation();
  const navigate = useNavigate();
  const { state } = useApp();
  const [bm, setBm] = useBookmark();
  const [notice, setNotice] = useState<string | null>(null);
  const [activeLv, setActiveLv] = useState<string>(LEVELS[0].id);
  const rootRef = useRef<HTMLDivElement>(null);

  const lectureIds = useMemo(() => new Set(LECTURES.map((l) => l.id)), []);
  const watched = useMemo(() => new Set(state.watchedLectures.filter((id) => lectureIds.has(id))), [state.watchedLectures, lectureIds]);
  const bmLesson = bm?.moduleId ? ALL_LESSONS.find((l) => l.module.id === bm.moduleId) ?? null : null;
  const bmLevel = levelOfBookmark(bm);

  // ── 책갈피로 가기: 강의를 열고(원고면 스크립트까지 펼쳐) 그 글을 찾아 가운데로 스크롤하고 반짝인다
  const goTo = useCallback((b: Bookmark) => {
    PENDING = b.key;
    if (b.moduleId) navigate(`/l/${b.moduleId}`, { replace: true });
    else navigate('/', { replace: true });
    const t0 = performance.now();
    let opened = false;
    const tick = () => {
      if (PENDING !== b.key) return;
      if (b.key.startsWith('ln:') && b.moduleId && !opened && document.getElementById(itemAnchor(b.moduleId))?.querySelector('.lecture')) {
        window.dispatchEvent(new CustomEvent(OPEN_SCRIPT_EVT, { detail: b.moduleId })); opened = true;
      }
      const el = document.querySelector(sel(b.key));
      if (el) {
        PENDING = null;
        el.scrollIntoView({ behavior: 'smooth', block: 'center' });
        el.classList.remove('bm-flash'); void (el as HTMLElement).offsetWidth; el.classList.add('bm-flash');
        return;
      }
      if (performance.now() - t0 < 4000) requestAnimationFrame(tick); else PENDING = null;
    };
    requestAnimationFrame(tick);
  }, [navigate]);

  // 상단 🔖 버튼은 /bm 으로 온다
  useEffect(() => {
    if (location.pathname !== '/bm') return;
    if (bm) goTo(bm); else navigate('/', { replace: true });
  }, [location.pathname]); // eslint-disable-line react-hooks/exhaustive-deps

  // 주소로 열린 강의 · 레벨로 이동(책갈피로 가는 중이면 그쪽이 스크롤한다)
  useEffect(() => {
    if (PENDING) return;
    if (moduleId) requestAnimationFrame(() => scrollToId(itemAnchor(moduleId), false));
    else if (levelId) requestAnimationFrame(() => scrollToId(levelAnchor(levelId), false));
  }, [moduleId, levelId]);

  // 레벨 레일 — 레일 바로 아래까지 올라온 마지막 레벨을 밝힌다
  useEffect(() => {
    let raf = 0;
    const pick = () => {
      raf = 0;
      let cur = LEVELS[0].id;
      for (const l of LEVELS) {
        const el = document.getElementById(levelAnchor(l.id));
        if (el && el.getBoundingClientRect().top <= 170) cur = l.id;
      }
      setActiveLv(cur);
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(pick); };
    pick();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { window.removeEventListener('scroll', onScroll); if (raf) cancelAnimationFrame(raf); };
  }, [moduleId]);

  // 꽂힌 자리 표시(🔖 리본) — 강의를 여닫거나 스크립트를 펼쳐 글이 새로 생겨도 다시 단다
  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const mark = () => {
      root.querySelectorAll('.bm-here').forEach((e) => { if (!bm || e.getAttribute('data-bm') !== bm.key) e.classList.remove('bm-here'); });
      if (bm) root.querySelector(sel(bm.key))?.classList.add('bm-here');
    };
    mark();
    const mo = new MutationObserver(mark);
    mo.observe(root, { childList: true, subtree: true });
    return () => mo.disconnect();
  }, [bm]);

  // 강의 한 줄에 꽂은 책갈피는 그 강의를 다 보면 다음 강의로 옮긴다(원고 문장 같은 자리 책갈피는 그대로 둔다)
  const prevWatched = useRef(watched);
  useEffect(() => {
    const before = prevWatched.current; prevWatched.current = watched;
    if (!bm || !bm.key.startsWith('lec:') || !bm.moduleId) return;
    const lec = lectureOfModule(bm.moduleId);
    if (!lec || before.has(lec.id) || !watched.has(lec.id)) return;
    const i = ALL_LESSONS.findIndex((l) => l.module.id === bm.moduleId);
    const next = ALL_LESSONS.slice(i + 1).find((l) => lectureOfModule(l.module.id));
    if (next) {
      setBm({ key: `lec:${next.module.id}`, label: next.module.title });
      setNotice(`다 봤어요! 책갈피를 다음 강의 「${next.module.title}」로 옮겼어요.`);
    }
  }, [watched, bm, setBm]);
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(null), 6000); return () => clearTimeout(t); }, [notice]);

  const place = useCallback((key: string, label: string) => {
    setBm({ key, label });
    setNotice(`🔖 여기에 꽂았어요 — 「${label.slice(0, 34)}${label.length > 34 ? '…' : ''}」`);
  }, [setBm]);

  const open = (id: string) => navigate(moduleId === id ? '/' : `/l/${id}`, { replace: true });
  const firstLesson = ALL_LESSONS.find((l) => lectureOfModule(l.module.id)) ?? ALL_LESSONS[0];

  return (
    <div className="cv" ref={rootRef}>
      <header className="cv-hero" data-bm="hero">
        <p className="cv-eyebrow">Jazzytory · 재즈피아노 학부 과정</p>
        <h1>리얼북 한 장으로 즉흥 연주까지</h1>
        <p className="cv-lede">레벨 0 진단부터 레벨 8 졸업 연주까지, 강의 {LECTURES.length}편을 위에서 아래로 차례로 봅니다. 읽다가 멈춘 곳 어디든 🔖 책갈피를 꽂아 두세요 — 글에 마우스를 올리면 왼쪽에 🔖 가 뜨고, 폰에서는 오른쪽 아래 「🔖 꽂기」를 누른 뒤 글을 누르면 됩니다.</p>
        <div className="cv-hero-row">
          {bm ? (
            <Link className="cv-resume" to="/bm" replace>
              <span className="cv-resume-tag">🔖 책갈피</span>
              <span className="cv-resume-title">
                {bmLesson ? `${bmLesson.module.levelId} · ${String(bmLesson.number).padStart(2, '0')} ${bmLesson.module.title}` : (bmLevel ? `${bmLevel} 레벨` : '커리큘럼')}
                {bm.label && !bm.key.startsWith('lec:') && <small className="cv-resume-quote">“{bm.label}”</small>}
              </span>
              <span className="cv-resume-go">이어서 보기 →</span>
            </Link>
          ) : (
            <Link className="cv-resume" to={`/l/${firstLesson.module.id}`} replace>
              <span className="cv-resume-tag">처음이라면</span>
              <span className="cv-resume-title">L0 · 01 {firstLesson.module.title}</span>
              <span className="cv-resume-go">여기서 시작 →</span>
            </Link>
          )}
          <div className="cv-meter" aria-label={`시청한 강의 ${watched.size}편 / ${LECTURES.length}편`}>
            <span className="cv-meter-num">{watched.size}<small> / {LECTURES.length}</small></span>
            <span className="cv-meter-label">본 강의</span>
            <span className="cv-meter-bar"><span style={{ width: `${(100 * watched.size) / LECTURES.length}%` }} /></span>
          </div>
        </div>
      </header>

      <nav className="cv-rail" aria-label="레벨로 이동">
        <ol>
          {LEVELS.map((l) => {
            const ls = lessonsOfCourse(l.id as LevelId).filter((x) => lectureOfModule(x.module.id));
            const done = ls.filter((x) => watched.has(lectureOfModule(x.module.id)!.id)).length;
            return (
              <li key={l.id}>
                <a href={`#/lv/${l.id}`} className={`cv-chip${activeLv === l.id ? ' on' : ''}${done && done === ls.length ? ' full' : ''}`}
                   onClick={(e) => { e.preventDefault(); navigate(`/lv/${l.id}`, { replace: true }); scrollToId(levelAnchor(l.id)); }}
                   aria-current={activeLv === l.id ? 'location' : undefined} title={`${l.id} ${l.title} · ${done}/${ls.length}편 시청`}>
                  {l.id}{bmLevel === l.id && <span className="cv-chip-bm" aria-label="책갈피가 있는 레벨">🔖</span>}
                  <span className="cv-chip-bar"><span style={{ width: ls.length ? `${(100 * done) / ls.length}%` : 0 }} /></span>
                </a>
              </li>
            );
          })}
        </ol>
      </nav>

      {LEVELS.map((l) => {
        const lessons = lessonsOfCourse(l.id as LevelId);
        const shelf = albumsOfLevel(l.id as LevelId);
        return (
          <section key={l.id} id={levelAnchor(l.id)} data-level={l.id} className="cv-level" aria-labelledby={`${levelAnchor(l.id)}-h`}>
            <header className="cv-level-head" data-bm={`lv:${l.id}`}>
              <span className="cv-level-id">{l.id}</span>
              <div className="stack stack-4">
                <h2 id={`${levelAnchor(l.id)}-h`}>{l.title}</h2>
                <p className="small dim" style={{ margin: 0 }}>{l.promise}</p>
                <span className="tiny muted">{l.weeks}주 · 주 {l.hoursPerWeek}시간 · {l.collegeEquivalent}</span>
              </div>
            </header>
            <ol className="cv-list">
              {lessons.map((ls) => {
                const mod = ls.module;
                const lec = lectureOfModule(mod.id);
                const isOpen = moduleId === mod.id;
                const isBm = bm?.key === `lec:${mod.id}`;
                const inside = !isBm && bm?.moduleId === mod.id;
                const seen = lec ? watched.has(lec.id) : false;
                return (
                  <li key={mod.id} id={itemAnchor(mod.id)} className={`cv-item${isOpen ? ' open' : ''}${isBm ? ' bm' : ''}${inside ? ' bm-in' : ''}${seen ? ' seen' : ''}`}>
                    <div className="cv-item-head" data-bm={`lec:${mod.id}`}>
                      <button type="button" className="cv-row" aria-expanded={isOpen} aria-controls={`${itemAnchor(mod.id)}-body`}
                              onClick={() => open(mod.id)} disabled={!lec}>
                        <span className="cv-no">{String(ls.number).padStart(2, '0')}</span>
                        <span className="cv-txt">
                          <span className="cv-title">{mod.title}</span>
                          <span className="cv-sum">{lec ? lec.summary : '강의 영상 곧 게시'}</span>
                        </span>
                        <span className="cv-meta">
                          {inside && <span className="cv-inside" title="이 강의 안에 책갈피가 있어요">🔖</span>}
                          {seen && <span className="cv-seen" aria-label="시청함">✓</span>}
                          {lec && <span className="cv-dur">{formatTime(lec.durationSec)}</span>}
                        </span>
                      </button>
                      <button type="button" className={`cv-bm${isBm ? ' on' : ''}`} aria-pressed={isBm}
                              aria-label={isBm ? '책갈피 빼기' : `「${mod.title}」에 책갈피 꽂기`} title={isBm ? '책갈피 빼기' : '이 강의에 책갈피'}
                              onClick={() => { if (isBm) { setBm(null); setNotice('책갈피를 뺐어요.'); } else place(`lec:${mod.id}`, mod.title); }}>
                        🔖
                      </button>
                    </div>
                    {isOpen && lec && (
                      <div id={`${itemAnchor(mod.id)}-body`} className="cv-body stack stack-24">
                        <LecturePlayer key={lec.id} lecture={lec} bare />
                        <LessonExtras moduleId={mod.id} />
                        <NextStep moduleId={mod.id} onGo={(id) => navigate(`/l/${id}`, { replace: true })} />
                      </div>
                    )}
                  </li>
                );
              })}
            </ol>
            {shelf.length > 0 && (
              <div className="cv-level-shelf" data-bm={`sh:${l.id}`}>
                <h3 className="tiny muted">{l.id} 필청 명반</h3>
                <AlbumShelf albums={shelf} label={`${l.id} 필청 명반`} />
              </div>
            )}
          </section>
        );
      })}

      <footer className="cv-end" data-bm="end">
        <p className="small dim" style={{ margin: 0 }}>강의에서 배운 손 모양 · 진행 · 귀는 <Link to="/lab">연습 랩</Link>에서 바로 쳐 볼 수 있습니다.</p>
      </footer>

      <BookmarkLayer rootRef={rootRef} onPlace={place} />
      {notice && <div className="cv-toast" role="status">{notice}</div>}
    </div>
  );
}

/**
 * 어느 글에든 책갈피를 꽂는 층.
 *  · 마우스: 글 블록(data-bm)에 올리면 왼쪽 여백에 🔖 가 뜬다 → 누르면 그 자리에 꽂힌다.
 *  · 모든 기기: 오른쪽 아래 「🔖 꽂기」 → 다음에 누르는 글이 책갈피 자리가 된다(그 글의 원래 동작은 이때만 막는다). Esc 로 취소.
 */
function BookmarkLayer({ rootRef, onPlace }: { rootRef: React.RefObject<HTMLDivElement | null>; onPlace: (key: string, label: string) => void }) {
  const [hover, setHover] = useState<{ key: string; label: string; x: number; y: number } | null>(null);
  const [picking, setPicking] = useState(false);
  const overBtn = useRef(false);

  useEffect(() => {
    const root = rootRef.current;
    if (!root) return;
    const onOver = (e: PointerEvent) => {
      if (e.pointerType !== 'mouse') return;           // 터치 · 펜은 「🔖 꽂기」로
      const el = (e.target as Element).closest?.('[data-bm]');
      if (!el || !root.contains(el) || el.closest('dialog')) return;
      const r = el.getBoundingClientRect();
      setHover({ key: el.getAttribute('data-bm')!, label: labelOf(el), x: Math.max(4, r.left - 40), y: r.top + Math.min(10, r.height / 2 - 15) });
    };
    const onLeave = () => { setTimeout(() => { if (!overBtn.current) setHover(null); }, 120); };
    const onScroll = () => setHover(null);
    root.addEventListener('pointerover', onOver);
    root.addEventListener('mouseleave', onLeave);
    window.addEventListener('scroll', onScroll, { passive: true, capture: true });
    return () => { root.removeEventListener('pointerover', onOver); root.removeEventListener('mouseleave', onLeave); window.removeEventListener('scroll', onScroll, { capture: true }); };
  }, [rootRef]);

  useEffect(() => {
    if (!picking) return;
    document.body.classList.add('bm-picking');
    const onClick = (e: MouseEvent) => {
      const t = e.target as Element;
      if (t.closest('.bm-fab')) return;
      const el = t.closest('[data-bm]');
      if (!el || !rootRef.current?.contains(el)) return;
      e.preventDefault(); e.stopPropagation();
      onPlace(el.getAttribute('data-bm')!, labelOf(el));
      setPicking(false);
    };
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setPicking(false); };
    document.addEventListener('click', onClick, true);
    document.addEventListener('keydown', onKey);
    return () => { document.body.classList.remove('bm-picking'); document.removeEventListener('click', onClick, true); document.removeEventListener('keydown', onKey); };
  }, [picking, onPlace, rootRef]);

  return (
    <>
      {hover && !picking && (
        <button type="button" className="bm-gutter" style={{ left: hover.x, top: hover.y }} title="여기에 책갈피"
                aria-label={`여기에 책갈피: ${hover.label.slice(0, 40)}`}
                onMouseEnter={() => { overBtn.current = true; }} onMouseLeave={() => { overBtn.current = false; setHover(null); }}
                onClick={() => { onPlace(hover.key, hover.label); setHover(null); overBtn.current = false; }}>
          🔖
        </button>
      )}
      <button type="button" className={`bm-fab${picking ? ' on' : ''}`} aria-pressed={picking} onClick={() => setPicking((p) => !p)}>
        {picking ? '꽂을 글을 누르세요 · 취소' : '🔖 꽂기'}
      </button>
    </>
  );
}

function LessonExtras({ moduleId }: { moduleId: string }) {
  const albums = albumsOfModule(moduleId);
  const videos = videosOfModule(moduleId);
  if (!albums.length && !videos.length) return null;
  return (
    <div className="cv-extras stack stack-16">
      {albums.length > 0 && (
        <div className="stack stack-8" data-bm={`al:${moduleId}`}>
          <h3 className="cv-sub-h">이 강의의 필청 명반</h3>
          <AlbumShelf albums={albums} moduleId={moduleId} label="이 강의의 필청 명반" />
        </div>
      )}
      {videos.length > 0 && (
        <div className="stack stack-8" data-bm={`vd:${moduleId}`}>
          <h3 className="cv-sub-h">함께 보면 좋은 영상</h3>
          <div className="grid grid-2">{videos.map((v) => <VideoCard key={v.id} video={v} />)}</div>
        </div>
      )}
    </div>
  );
}

function NextStep({ moduleId, onGo }: { moduleId: string; onGo: (id: string) => void }) {
  const i = ALL_LESSONS.findIndex((l) => l.module.id === moduleId);
  const next = ALL_LESSONS.slice(i + 1).find((l) => lectureOfModule(l.module.id));
  if (!next) return <p className="small dim" style={{ margin: 0 }}>마지막 강의입니다. <RichText text="수고하셨습니다 — **졸업 연주**까지 왔어요." /></p>;
  return (
    <div className="cv-next">
      <span className="tiny muted">다음 강의 · {next.module.levelId} {String(next.number).padStart(2, '0')}</span>
      <button type="button" className="btn btn-primary" onClick={() => onGo(next.module.id)}>{next.module.title} →</button>
    </div>
  );
}
