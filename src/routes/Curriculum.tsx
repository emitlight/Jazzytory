import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate, useParams } from 'react-router-dom';
import { LEVELS, ALL_LESSONS, lessonsOfCourse, albumsOfModule, albumsOfLevel, videosOfModule } from '../data';
import type { LevelId } from '../data/types';
import { lectureOfModule, formatTime, LECTURES } from '../data/lectures';
import { useApp } from '../state';
import { useBookmark } from '../lib/bookmark';
import LecturePlayer from '../components/LecturePlayer';
import VideoCard from '../components/VideoCard';
import AlbumShelf from '../components/AlbumShelf';
import { RichText } from '../components/Prose';

const levelAnchor = (id: string) => `lv-${id}`;
const itemAnchor = (moduleId: string) => `lec-${moduleId}`;

/** 화면 위 고정 띠(상단 바 + 레벨 레일) 아래로 맞춰 스크롤한다 */
function scrollToId(id: string, smooth = true) {
  const el = document.getElementById(id);
  if (!el) return;
  el.scrollIntoView({ behavior: smooth ? 'smooth' : 'auto', block: 'start' });
}

/**
 * 커리큘럼 — L0 부터 L8 까지 51편을 한 페이지에 세로로 편다.
 * 강의를 누르면 그 자리에서 영상 · 그 강의의 명반 · 추천 영상이 펼쳐지고, 🔖 로 「여기까지」를 꽂아 둔다.
 * 메뉴를 돌아다니지 않고 위에서 아래로 내려가며 배우게 하는 것이 이 화면의 목적이다.
 */
export default function Curriculum() {
  const { moduleId, levelId } = useParams();
  const navigate = useNavigate();
  const { state } = useApp();
  const [bm, setBm] = useBookmark();
  const [notice, setNotice] = useState<string | null>(null);
  const [activeLv, setActiveLv] = useState<string>(LEVELS[0].id);

  const lectureIds = useMemo(() => new Set(LECTURES.map((l) => l.id)), []);
  const watched = useMemo(() => new Set(state.watchedLectures.filter((id) => lectureIds.has(id))), [state.watchedLectures, lectureIds]);
  const bmLesson = bm ? ALL_LESSONS.find((l) => l.module.id === bm.moduleId) ?? null : null;

  // 주소로 열린 강의 · 레벨로 이동
  useEffect(() => {
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

  // 책갈피를 꽂은 강의를 끝까지 보면 다음 강의로 옮긴다
  const prevWatched = useRef(watched);
  useEffect(() => {
    const before = prevWatched.current; prevWatched.current = watched;
    if (!bm || !bmLesson) return;
    const lec = lectureOfModule(bm.moduleId);
    if (!lec || before.has(lec.id) || !watched.has(lec.id)) return;
    const i = ALL_LESSONS.findIndex((l) => l.module.id === bm.moduleId);
    const next = ALL_LESSONS.slice(i + 1).find((l) => lectureOfModule(l.module.id));
    if (next) {
      setBm(next.module.id);
      setNotice(`다 봤어요! 책갈피를 다음 강의 「${next.module.title}」로 옮겼어요.`);
    }
  }, [watched, bm, bmLesson, setBm]);
  useEffect(() => { if (!notice) return; const t = setTimeout(() => setNotice(null), 6000); return () => clearTimeout(t); }, [notice]);

  const open = (id: string) => navigate(moduleId === id ? '/' : `/l/${id}`, { replace: true });
  const firstLesson = ALL_LESSONS.find((l) => lectureOfModule(l.module.id)) ?? ALL_LESSONS[0];

  return (
    <div className="cv">
      <header className="cv-hero">
        <p className="cv-eyebrow">Jazzytory · 재즈피아노 학부 과정</p>
        <h1>리얼북 한 장으로 즉흥 연주까지</h1>
        <p className="cv-lede">레벨 0 진단부터 레벨 8 졸업 연주까지, 강의 {LECTURES.length}편을 위에서 아래로 차례로 봅니다. 보던 자리에는 🔖 책갈피를 꽂아 두세요.</p>
        <div className="cv-hero-row">
          {bmLesson ? (
            <Link className="cv-resume" to={`/l/${bmLesson.module.id}`} replace>
              <span className="cv-resume-tag">🔖 책갈피</span>
              <span className="cv-resume-title">{bmLesson.module.levelId} · {String(bmLesson.number).padStart(2, '0')} {bmLesson.module.title}</span>
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
            const here = bmLesson?.module.levelId === l.id;
            return (
              <li key={l.id}>
                <a href={`#/lv/${l.id}`} className={`cv-chip${activeLv === l.id ? ' on' : ''}${done && done === ls.length ? ' full' : ''}`}
                   onClick={(e) => { e.preventDefault(); navigate(`/lv/${l.id}`, { replace: true }); scrollToId(levelAnchor(l.id)); }}
                   aria-current={activeLv === l.id ? 'location' : undefined} title={`${l.id} ${l.title} · ${done}/${ls.length}편 시청`}>
                  {l.id}{here && <span className="cv-chip-bm" aria-label="책갈피가 있는 레벨">🔖</span>}
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
            <header className="cv-level-head">
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
                const isBm = bm?.moduleId === mod.id;
                const seen = lec ? watched.has(lec.id) : false;
                return (
                  <li key={mod.id} id={itemAnchor(mod.id)} className={`cv-item${isOpen ? ' open' : ''}${isBm ? ' bm' : ''}${seen ? ' seen' : ''}`}>
                    <div className="cv-item-head">
                      <button type="button" className="cv-row" aria-expanded={isOpen} aria-controls={`${itemAnchor(mod.id)}-body`}
                              onClick={() => open(mod.id)} disabled={!lec}>
                        <span className="cv-no">{String(ls.number).padStart(2, '0')}</span>
                        <span className="cv-txt">
                          <span className="cv-title">{mod.title}</span>
                          <span className="cv-sum">{lec ? lec.summary : '강의 영상 곧 게시'}</span>
                        </span>
                        <span className="cv-meta">
                          {seen && <span className="cv-seen" aria-label="시청함">✓</span>}
                          {lec && <span className="cv-dur">{formatTime(lec.durationSec)}</span>}
                        </span>
                      </button>
                      <button type="button" className={`cv-bm${isBm ? ' on' : ''}`} aria-pressed={isBm}
                              aria-label={isBm ? '책갈피 빼기' : `「${mod.title}」에 책갈피 꽂기`} title={isBm ? '책갈피 빼기' : '여기에 책갈피'}
                              onClick={() => { setBm(isBm ? null : mod.id); setNotice(isBm ? '책갈피를 뺐어요.' : `「${mod.title}」에 책갈피를 꽂았어요.`); }}>
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
              <div className="cv-level-shelf">
                <h3 className="tiny muted">{l.id} 필청 명반</h3>
                <AlbumShelf albums={shelf} label={`${l.id} 필청 명반`} />
              </div>
            )}
          </section>
        );
      })}

      <footer className="cv-end">
        <p className="small dim" style={{ margin: 0 }}>강의에서 배운 손 모양 · 진행 · 귀는 <Link to="/lab">연습 랩</Link>에서 바로 쳐 볼 수 있습니다.</p>
      </footer>

      {notice && <div className="cv-toast" role="status">{notice}</div>}
    </div>
  );
}

function LessonExtras({ moduleId }: { moduleId: string }) {
  const albums = albumsOfModule(moduleId);
  const videos = videosOfModule(moduleId);
  if (!albums.length && !videos.length) return null;
  return (
    <div className="cv-extras stack stack-16">
      {albums.length > 0 && (
        <div className="stack stack-8">
          <h3 className="cv-sub-h">이 강의의 필청 명반</h3>
          <AlbumShelf albums={albums} moduleId={moduleId} label="이 강의의 필청 명반" />
        </div>
      )}
      {videos.length > 0 && (
        <div className="stack stack-8">
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
