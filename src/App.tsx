import { Suspense, lazy, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation, Link, Navigate } from 'react-router-dom';
import { useApp } from './state';

const Home           = lazy(() => import('./routes/Home'));
const Courses        = lazy(() => import('./routes/Courses'));
const CourseHome     = lazy(() => import('./routes/CourseHome'));
const Lesson         = lazy(() => import('./routes/Lesson'));
const Library        = lazy(() => import('./routes/Library'));
const Lab            = lazy(() => import('./routes/Lab'));
const TunePage       = lazy(() => import('./routes/TunePage'));
const Progress       = lazy(() => import('./routes/Progress'));
const Placement      = lazy(() => import('./routes/Placement'));
const ModuleRedirect = lazy(() => import('./routes/ModuleRedirect'));

/** 메뉴는 네 개다. 학습자가 고를 것이 많을수록 아무것도 고르지 않는다. */
const NAV = [
  { to: '/courses',  label: '강의실' },
  { to: '/lab',      label: '연습 랩' },
  { to: '/library',  label: '자료실' },
  { to: '/progress', label: '내 진도' },
];

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

  // 라우트 전환 시 스크롤 최상단 + 포커스 이동 (접근성)
  useEffect(() => {
    window.scrollTo(0, 0);
    const h1 = mainRef.current?.querySelector('h1');
    if (h1 instanceof HTMLElement) {
      h1.setAttribute('tabindex', '-1');
      h1.focus({ preventScroll: true });
    }
  }, [location.pathname]);

  return (
    <div className="shell">
      <a className="skip" href="#main">본문으로 건너뛰기</a>

      <header className="topbar">
        <div className="wrap topbar-inner">
          <Link to="/" className="brand">
            <span className="brand-mark" aria-hidden="true">J</span>
            Jazzytory
          </Link>
          <nav className="nav" aria-label="주요 메뉴">
            {NAV.map((n) => (
              <NavLink key={n.to} to={n.to} className={({ isActive }) => (isActive ? 'active' : '')}>
                {n.label}
              </NavLink>
            ))}
          </nav>
          <span className="spacer" />
          <ThemeToggle />
        </div>
      </header>

      <main id="main" ref={mainRef} className="page wrap">
        <Suspense fallback={<p className="muted" role="status">불러오는 중…</p>}>
          <Routes>
            <Route path="/" element={<Home />} />

            {/* 강의실 · 강좌 · 차시 */}
            <Route path="/courses" element={<Courses />} />
            <Route path="/course/:levelId" element={<CourseHome />} />
            <Route path="/course/:levelId/lesson/:lessonNo" element={<Lesson />} />

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
          <div className="row" style={{ gap: 16 }}>
            <Link to="/library/glossary">용어집</Link>
            <Link to="/library/pedagogy">교수법</Link>
            <Link to="/library/review">검수 정책</Link>
            <Link to="/placement">배치고사</Link>
          </div>
          <p style={{ margin: 0 }}>
            Jazzytory 는 학습용 도구입니다. 스탠다드는 <strong>화성 진행(코드)만</strong> 수록하며
            멜로디·가사·채보 솔로를 포함하지 않습니다. 음원은 호스팅하지 않습니다.
          </p>
          <p style={{ margin: 0 }}>
            편집 검수 패널은 <strong>교수법 계보를 대표하는 가상의 심사 기준</strong>이며 실존 인물이 아닙니다.
            실제 교수 검수는 아직 받지 않았습니다. — <Link to="/library/review">자세히</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}

/** 구 /curriculum/:levelId → /course/:levelId */
function CourseRedirect() {
  const path = window.location.hash.replace(/^#\/curriculum\//, '');
  return <Navigate to={`/course/${path}`} replace />;
}
