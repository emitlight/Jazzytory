import { Suspense, lazy, useEffect, useRef, useState } from 'react';
import { Routes, Route, NavLink, useLocation, Link, Navigate, useParams } from 'react-router-dom';
import { useApp } from './state';
import { SIMPLE_UI } from './config';
import { useBookmark } from './lib/bookmark';
import { LEVELS, lessonAt } from './data';
import type { LevelId } from './data/types';

const Curriculum     = lazy(() => import('./routes/Curriculum'));
const Guide          = lazy(() => import('./routes/Guide'));
const Library        = lazy(() => import('./routes/Library'));
const Lab            = lazy(() => import('./routes/Lab'));
const TunePage       = lazy(() => import('./routes/TunePage'));
const Progress       = lazy(() => import('./routes/Progress'));
const Placement      = lazy(() => import('./routes/Placement'));
const ModuleRedirect = lazy(() => import('./routes/ModuleRedirect'));

/** 메뉴는 두 개다 — 배우는 곳(커리큘럼 한 페이지)과 손으로 치는 곳(연습 랩). 나머지는 책갈피 · 더 보기에 접어 둔다. */
const NAV = [
  { to: '/', label: '커리큘럼' },
  { to: '/lab', label: '연습 랩' },
];
const MORE = [
  { to: '/progress', label: '내 진도', d: '본 강의 · 연습 시간 · 8개 축 · 데이터 백업' },
  { to: '/guide', label: '사용법 영상', d: '6분 — 이 서비스 쓰는 법' },
  { to: '/library/listening', label: '필청 명반 전체', d: '38장 — 이유와 청취 과제' },
];
const isCurriculum = (p: string) => p === '/' || p.startsWith('/l/') || p.startsWith('/lv/');

function BookmarkButton() {
  const [bm] = useBookmark();
  if (!bm) return <span className="btn btn-sm btn-ghost bm-btn" aria-disabled="true" title="강의 옆 🔖 로 책갈피를 꽂아 두세요">🔖<span className="bm-btn-t">책갈피</span></span>;
  return <Link className="btn btn-sm bm-btn on" to={`/l/${bm.moduleId}`} replace title="책갈피로 이동">🔖<span className="bm-btn-t">책갈피</span></Link>;
}

function MoreMenu() {
  const [open, setOpen] = useState(false);
  const loc = useLocation();
  useEffect(() => { setOpen(false); }, [loc.pathname]);
  return (
    <div className="more">
      <button type="button" className="btn btn-sm btn-ghost" aria-expanded={open} aria-haspopup="true" onClick={() => setOpen((o) => !o)} aria-label="더 보기">⋯</button>
      {open && (
        <>
          <div className="more-scrim" aria-hidden="true" onClick={() => setOpen(false)} />
          <ul className="more-pop" role="menu">
            {MORE.map((m) => (
              <li key={m.to} role="none"><Link role="menuitem" to={m.to}><strong>{m.label}</strong><span className="tiny muted">{m.d}</span></Link></li>
            ))}
            <li role="none" className="more-theme"><span className="small">테마</span><ThemeToggle /></li>
          </ul>
        </>
      )}
    </div>
  );
}

function ThemeToggle() {
  const { state, update } = useApp();
  const order = ['system', 'light', 'dark'] as const;
  const label = { system: '시스템', light: '라이트', dark: '다크' }[state.settings.theme];
  return (
    <button
      className="btn btn-sm btn-ghost"
      onClick={() => update((s) => {
        const i = order.indexOf(s.settings.theme);
        return { ...s, settings: { ...s.settings, theme: order[(i + 1) % order.length] } };
      })}
      aria-label={`테마 전환. 현재 ${label}`}
      title={`테마: ${label}`}
    >
      {state.settings.theme === 'dark' ? '◑' : state.settings.theme === 'light' ? '◐' : '◒'}
      <span className="sr-only">{label}</span>
    </button>
  );
}

export default function App() {
  const location = useLocation();
  const mainRef = useRef<HTMLElement>(null);
  const [menuOpen, setMenuOpen] = useState(false);

  // 폰 메뉴는 이동하면 닫힌다
  useEffect(() => { setMenuOpen(false); }, [location.pathname]);
  useEffect(() => {
    if (!menuOpen) return;
    const onKey = (e: KeyboardEvent) => { if (e.key === 'Escape') setMenuOpen(false); };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  }, [menuOpen]);

  // 라우트 전환 시 스크롤 최상단 + 포커스 이동 (접근성)
  // 첫 진입에는 포커스를 옮기지 않는다 — Safari 는 이때 h1 에 포커스 링을 그린다.
  const firstRoute = useRef(true);
  const lastPath = useRef(location.pathname);
  useEffect(() => {
    const from = lastPath.current; lastPath.current = location.pathname;
    // 커리큘럼 안에서 강의 · 레벨을 여닫을 때는 그 페이지가 스스로 스크롤한다
    if (isCurriculum(from) && isCurriculum(location.pathname) && !firstRoute.current) return;
    window.scrollTo(0, 0);
    if (firstRoute.current) { firstRoute.current = false; return; }
    const h1 = mainRef.current?.querySelector('h1');
    if (h1 instanceof HTMLElement) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }, [location.pathname]);

  return (
    <div className="shell">
      <a className="skip" href="#main">본문으로 건너뛰기</a>

      <header className={`topbar${menuOpen ? ' menu-open' : ''}`}>
        <div className="wrap topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">J</span>
            Jazzytory
          </Link>
          <nav id="main-nav" className="nav" aria-label="주요 메뉴">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive || (n.to === '/' && isCurriculum(location.pathname)) ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
            {/* 폰 메뉴에서만 보이는 보조 링크 — 데스크톱은 푸터에 있다. 간단 보기에서는 숨긴다 */}
            {!SIMPLE_UI && (
              <>
                <span className="nav-extra" aria-hidden="true" />
                <NavLink to="/library/glossary" className="nav-extra">용어집</NavLink>
                <NavLink to="/placement" className="nav-extra">배치고사</NavLink>
              </>
            )}
          </nav>
          <span className="spacer" />
          <BookmarkButton />
          <MoreMenu />
          <button
            type="button"
            className="btn btn-sm btn-ghost menu-toggle"
            aria-expanded={menuOpen}
            aria-controls="main-nav"
            onClick={() => setMenuOpen((o) => !o)}
          >
            <span aria-hidden="true" className="menu-icon" />
            {menuOpen ? '닫기' : '메뉴'}
          </button>
        </div>
        {menuOpen && <div className="menu-scrim" aria-hidden="true" onClick={() => setMenuOpen(false)} />}
      </header>

      <main id="main" ref={mainRef} className="page wrap">
        <Suspense fallback={<p className="muted" role="status">불러오는 중…</p>}>
          <Routes>
            <Route path="/" element={<Curriculum />} />
            <Route path="/l/:moduleId" element={<Curriculum />} />
            <Route path="/lv/:levelId" element={<Curriculum />} />
            <Route path="/guide" element={<Guide />} />

            {/* 강의실 · 강좌 · 차시 */}
            {/* 구 강의실 · 강좌 · 차시 → 커리큘럼 한 페이지의 그 자리 */}
            <Route path="/courses" element={<Navigate to="/" replace />} />
            <Route path="/course/:levelId" element={<LevelRedirect />} />
            <Route path="/course/:levelId/lesson/:lessonNo" element={<LessonRedirect />} />

            {/* 자료실 */}
            <Route path="/library" element={<Library />} />
            <Route path="/library/:tab" element={<Library />} />
            <Route path="/tunes/:tuneId" element={<TunePage />} />

            {/* 도구 */}
            <Route path="/lab" element={<Lab />} />
            <Route path="/lab/:tab" element={<Lab />} />

            <Route path="/progress" element={<Progress />} />
            <Route path="/placement" element={<Placement />} />

            {/* 구 경로 호환 */}
            <Route path="/module/:moduleId" element={<ModuleRedirect />} />
            <Route path="/curriculum" element={<Navigate to="/courses" replace />} />
            <Route path="/curriculum/:levelId" element={<CourseRedirect />} />
            <Route path="/tunes" element={<Navigate to="/library/tunes" replace />} />
            <Route path="/listening" element={<Navigate to="/library/listening" replace />} />
            <Route path="/videos" element={<Navigate to="/library/videos" replace />} />
            <Route path="/pedagogy" element={<Navigate to="/library/pedagogy" replace />} />
            <Route path="/glossary" element={<Navigate to="/library/glossary" replace />} />
            <Route path="/faculty" element={<Navigate to="/library/review" replace />} />

            <Route path="*" element={
              <div className="stack stack-16">
                <h1>없는 페이지입니다</h1>
                <p className="dim">주소를 확인해 주세요.</p>
                <Link className="btn btn-primary" to="/">첫 화면으로</Link>
              </div>
            } />
          </Routes>
        </Suspense>
      </main>

      <footer className="footer">
        <div className="wrap stack stack-8">
          {!SIMPLE_UI && (
            <div className="row" style={{ gap: 16 }}>
              <Link to="/library/glossary">용어집</Link>
              <Link to="/library/pedagogy">교수법</Link>
              <Link to="/library/review">검수 정책</Link>
              <Link to="/placement">배치고사</Link>
            </div>
          )}
          <p style={{ margin: 0 }}>
            Jazzytory 는 학습용 도구입니다. 스탠다드는 <strong>화성 진행(코드)만</strong> 수록하며
            멜로디·가사·채보 솔로를 포함하지 않습니다. 음원은 호스팅하지 않습니다.
          </p>
          {!SIMPLE_UI && (
            <p style={{ margin: 0 }}>
              편집 검수 패널은 <strong>교수법 계보를 대표하는 가상의 심사 기준</strong>이며 실존 인물이 아닙니다.
              실제 교수 검수는 아직 받지 않았습니다. — <Link to="/library/review">자세히</Link>
            </p>
          )}
        </div>
      </footer>
    </div>
  );
}

/** 구 /course/:levelId → 커리큘럼의 그 레벨 */
function LevelRedirect() {
  const { levelId } = useParams();
  return <Navigate to={LEVELS.some((l) => l.id === levelId) ? `/lv/${levelId}` : '/'} replace />;
}

/** 구 /course/:levelId/lesson/:n → 커리큘럼에서 그 강의를 연 채로 */
function LessonRedirect() {
  const { levelId, lessonNo } = useParams();
  const ls = levelId && LEVELS.some((l) => l.id === levelId) ? lessonAt(levelId as LevelId, Number(lessonNo)) : null;
  return <Navigate to={ls ? `/l/${ls.module.id}` : '/'} replace />;
}

/** 구 /curriculum/:levelId → /course/:levelId */
function CourseRedirect() {
  const path = window.location.hash.replace(/^#\/curriculum\//, '');
  return <Navigate to={`/course/${path}`} replace />;
}
