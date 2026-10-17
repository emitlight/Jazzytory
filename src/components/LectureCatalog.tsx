import { Link } from 'react-router-dom';
import { LEVELS, lessonsOfCourse } from '../data';
import { LECTURES, lectureOfModule, formatTime } from '../data/lectures';
import { useApp } from '../state';

/**
 * 오리지널 강의 목록 — 레벨 L0→L8 순, 레벨 안에서는 커리큘럼(차시) 순서.
 * 강의가 아직 없는 차시는 "곧 게시" 로 흐리게 남겨 51차시 로드맵이 그대로 보이게 한다.
 * 첫 화면(간단 보기)·자료실 「강의」 탭·자료실 「영상」 탭이 같은 컴포넌트를 쓴다.
 */
export default function LectureCatalog({ upcoming = true }: { upcoming?: boolean }) {
  const { state } = useApp();
  const groups = LEVELS.map((level) => {
    const lessons = lessonsOfCourse(level.id);
    const published = lessons.flatMap((l) => {
      const lec = lectureOfModule(l.module.id);
      return lec ? [{ lesson: l, lec }] : [];
    });
    const pending = lessons.filter((l) => !lectureOfModule(l.module.id));
    return { level, published, pending };
  }).filter((g) => g.published.length > 0 || upcoming);

  return (
    <div className="stack stack-24">
      {groups.map(({ level, published, pending }) => (
        <section key={level.id} className="stack stack-8" aria-label={`${level.id} ${level.title}`}>
          <div className="row" style={{ gap: 8 }}>
            <span className="level-dot" style={{ background: level.accentColor }} aria-hidden="true" />
            <span className="eyebrow">{level.id} {level.title}</span>
            <span className="tiny muted">{published.length}/{published.length + pending.length}편</span>
          </div>

          {published.length > 0 && (
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
          )}

          {upcoming && pending.length > 0 && (
            <ul className="lecture-upcoming" aria-label="곧 게시될 강의">
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
        </section>
      ))}
      {LECTURES.length === 0 && <p className="muted small">아직 게시된 강의가 없습니다.</p>}
    </div>
  );
}
