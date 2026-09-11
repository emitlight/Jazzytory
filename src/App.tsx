import { Suspense, lazy, useEffect, useRef } from 'react';
import { Routes, Route, NavLink, useLocation, Link } from 'react-router-dom';
import { useApp } from './state';

const Home       = lazy(() => import('./routes/Home'));
const Curriculum = lazy(() => import('./routes/Curriculum'));
const LevelPage  = lazy(() => import('./routes/LevelPage'));
const ModulePage = lazy(() => import('./routes/ModulePage'));
const Lab        = lazy(() => import('./routes/Lab'));
const Tunes      = lazy(() => import('./routes/Tunes'));
const TunePage   = lazy(() => import('./routes/TunePage'));
const Listening  = lazy(() => import('./routes/Listening'));
const Videos     = lazy(() => import('./routes/Videos'));
const Progress   = lazy(() => import('./routes/Progress'));
const Faculty    = lazy(() => import('./routes/Faculty'));
const Glossary   = lazy(() => import('./routes/Glossary'));
const Placement  = lazy(() => import('./routes/Placement'));

const NAV = [
  { to: '/curriculum', label: '커리큘럼' },
  { to: '/lab',        label: '연습 랩' },
  { to: '/tunes',      label: '레퍼토리' },
  { to: '/listening',  label: '필청 명반' },
  { to: '/videos',     label: '영상 강의' },
  { to: '/progress',   label: '내 진도' },
  { to: '/faculty',    label: '검수' },
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
            <Route path="/curriculum" element={<Curriculum />} />
            <Route path="/curriculum/:levelId" element={<LevelPage />} />
            <Route path="/module/:moduleId" element={<ModulePage />} />
            <Route path="/lab" element={<Lab />} />
            <Route path="/lab/:tab" element={<Lab />} />
            <Route path="/tunes" element={<Tunes />} />
            <Route path="/tunes/:tuneId" element={<TunePage />} />
            <Route path="/listening" element={<Listening />} />
            <Route path="/videos" element={<Videos />} />
            <Route path="/progress" element={<Progress />} />
            <Route path="/faculty" element={<Faculty />} />
            <Route path="/glossary" element={<Glossary />} />
            <Route path="/placement" element={<Placement />} />
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
            <Link to="/glossary">용어집</Link>
            <Link to="/faculty">검수 정책</Link>
            <Link to="/placement">배치고사</Link>
          </div>
          <p style={{ margin: 0 }}>
            Jazzytory 는 학습용 도구입니다. 스탠다드는 <strong>화성 진행(코드)만</strong> 수록하며
            멜로디·가사·채보 솔로를 포함하지 않습니다. 음원은 호스팅하지 않습니다.
          </p>
          <p style={{ margin: 0 }}>
            편집 검수 패널은 <strong>교수법 계보를 대표하는 가상의 심사 기준</strong>이며 실존 인물이 아닙니다.
            실제 교수 검수는 아직 받지 않았습니다. — <Link to="/faculty">자세히</Link>
          </p>
        </div>
      </footer>
    </div>
  );
}
