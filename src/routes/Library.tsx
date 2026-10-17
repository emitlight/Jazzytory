import { Suspense, lazy } from 'react';
import { useParams, Navigate, NavLink } from 'react-router-dom';
import { SIMPLE_UI } from '../config';
import LectureCatalog from '../components/LectureCatalog';
import { LECTURES } from '../data/lectures';

const Tunes     = lazy(() => import('./Tunes'));
const Listening = lazy(() => import('./Listening'));
const Videos    = lazy(() => import('./Videos'));
const Pedagogy  = lazy(() => import('./Pedagogy'));
const Glossary  = lazy(() => import('./Glossary'));
const Faculty   = lazy(() => import('./Faculty'));

/** 모든 탭 — 경로는 두 모드에서 전부 열린다 */
const ALL_TABS = [
  { id: 'lectures',  label: '강의' },
  { id: 'tunes',     label: '레퍼토리' },
  { id: 'listening', label: '필청 명반' },
  { id: 'videos',    label: '영상 강의' },
  { id: 'pedagogy',  label: '교수법' },
  { id: 'glossary',  label: '용어집' },
  { id: 'review',    label: '검수' },
] as const;

/** 탭 줄에 보이는 것 — 간단 보기는 강의·필청 명반만, 전체 보기는 기존 6개(강의는 영상 탭 안에 있다) */
const VISIBLE = SIMPLE_UI
  ? ALL_TABS.filter((t) => t.id === 'lectures' || t.id === 'listening')
  : ALL_TABS.filter((t) => t.id !== 'lectures');
const DEFAULT_TAB = SIMPLE_UI ? 'lectures' : 'tunes';

function Lectures() {
  return (
    <div className="stack stack-24">
      <header className="stack stack-8">
        <span className="eyebrow">Original Lectures</span>
        <h1 style={{ margin: 0 }}>오리지널 강의 {LECTURES.length}편</h1>
        <p className="small dim" style={{ margin: 0 }}>차시마다 직접 만든 해설 영상입니다. 아직 없는 차시는 「곧 게시」로 표시됩니다.</p>
      </header>
      <LectureCatalog />
    </div>
  );
}

/**
 * 자료실 — 강좌 바깥에서 따로 찾아볼 자료를 한 곳에 모은다.
 * 차시 안에도 같은 내용이 들어가지만, "그 곡만 다시 보고 싶다"는 요구는 따로 있다.
 */
export default function Library() {
  const { tab } = useParams();
  if (!tab || !ALL_TABS.some((t) => t.id === tab)) return <Navigate to={`/library/${DEFAULT_TAB}`} replace />;

  return (
    <div className="stack stack-24">
      <nav className="seg" aria-label="자료실 분류">
        {VISIBLE.map((t) => (
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
        {tab === 'lectures' && <Lectures />}
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
