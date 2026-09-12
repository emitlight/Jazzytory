import { Suspense, lazy } from 'react';
import { useParams, Navigate, NavLink } from 'react-router-dom';

const Tunes     = lazy(() => import('./Tunes'));
const Listening = lazy(() => import('./Listening'));
const Videos    = lazy(() => import('./Videos'));
const Pedagogy  = lazy(() => import('./Pedagogy'));
const Glossary  = lazy(() => import('./Glossary'));
const Faculty   = lazy(() => import('./Faculty'));

const TABS = [
  { id: 'tunes',     label: '레퍼토리' },
  { id: 'listening', label: '필청 명반' },
  { id: 'videos',    label: '영상 강의' },
  { id: 'pedagogy',  label: '교수법' },
  { id: 'glossary',  label: '용어집' },
  { id: 'review',    label: '검수' },
] as const;

/**
 * 자료실 — 강좌 바깥에서 따로 찾아볼 자료를 한 곳에 모은다.
 * 차시 안에도 같은 내용이 들어가지만, "그 곡만 다시 보고 싶다"는 요구는 따로 있다.
 */
export default function Library() {
  const { tab } = useParams();
  if (!tab) return <Navigate to="/library/tunes" replace />;
  if (!TABS.some((t) => t.id === tab)) return <Navigate to="/library/tunes" replace />;

  return (
    <div className="stack stack-24">
      <nav className="seg" aria-label="자료실 분류">
        {TABS.map((t) => (
          <NavLink
            key={t.id}
            to={`/library/${t.id}`}
            className={({ isActive }) => `seg-item${isActive ? ' active' : ''}`}
          >
            {t.label}
          </NavLink>
        ))}
      </nav>

      <Suspense fallback={<p className="muted" role="status">불러오는 중…</p>}>
        {tab === 'tunes' && <Tunes />}
        {tab === 'listening' && <Listening />}
        {tab === 'videos' && <Videos />}
        {tab === 'pedagogy' && <Pedagogy />}
        {tab === 'glossary' && <Glossary />}
        {tab === 'review' && <Faculty />}
      </Suspense>
    </div>
  );
}
