import { Link } from 'react-router-dom';
import { LEVELS, courseProgress, lessonsOfCourse, CONTENT_STATS } from '../data';
import { useApp } from '../state';
import { RichText } from '../components/Prose';

/** 강의실 — 9개 강좌를 학기 순서로 보여준다 */
export default function Courses() {
  const { state } = useApp();
  const placed = state.placedLevel;

  // 이어서 학습할 강좌: 배정 레벨부터 훑어 미완료 차시가 있는 첫 강좌
  const current = LEVELS.find((l) => {
    if (placed && l.id < placed) return false;
    return courseProgress(l.id, state.completedModules).resume !== null;
  });

  return (
    <div className="stack stack-32">
      <header className="stack stack-12">
        <span className="eyebrow">My Courses</span>
        <h1 style={{ margin: 0 }}>강의실</h1>
        <p className="lead" style={{ maxWidth: '58ch' }}>
          9개 강좌 · {CONTENT_STATS.modules}차시. 대학 학기처럼 순서가 있고, 각 강좌는
          실기시험(jury)에 준하는 수료 기준을 갖습니다. 차시 하나에 그 단원의 개념·연습·곡·
          청음·평가가 전부 들어 있습니다 — 메뉴를 돌아다닐 필요가 없습니다.
        </p>
      </header>

      {current && (
        <section className="card card-feature stack stack-12">
          <span className="eyebrow">이어서 학습</span>
          {(() => {
            const p = courseProgress(current.id, state.completedModules);
            return (
              <>
                <div className="row-between">
                  <div className="stack stack-4">
                    <div className="row">
                      <span className="badge badge-accent">{current.id}</span>
                      <strong style={{ fontSize: '1.2rem' }}>{current.title}</strong>
                    </div>
                    {p.resume && (
                      <span className="small dim">
                        {p.resume.number}차시 · {p.resume.module.title}
                      </span>
                    )}
                  </div>
                  {p.resume && (
                    <Link className="btn btn-primary btn-lg" to={p.resume.path}>
                      학습 이어하기 →
                    </Link>
                  )}
                </div>
                <div className="bar"><span style={{ width: `${p.percent}%` }} /></div>
                <span className="tiny muted">{p.done}/{p.total}차시 완료 · {p.percent}%</span>
              </>
            );
          })()}
        </section>
      )}

      <section className="stack stack-16">
        <div className="section-head row-between">
          <h2 style={{ margin: 0 }}>전체 강좌</h2>
          {!placed && <Link className="btn btn-sm" to="/placement">배치고사로 내 강좌 찾기</Link>}
        </div>

        <div className="stack stack-12">
          {LEVELS.map((l) => {
            const p = courseProgress(l.id, state.completedModules);
            const lessons = lessonsOfCourse(l.id);
            const isPlaced = placed === l.id;
            const locked = placed ? l.id > placed && p.done === 0 : false;
            return (
              <Link
                key={l.id}
                to={`/course/${l.id}`}
                className="card card-link stack stack-12"
                style={locked ? { opacity: 0.62 } : undefined}
              >
                <div className="level-strip" style={{ background: l.accentColor }} />
                <div className="row-between">
                  <div className="stack stack-4" style={{ flex: 1, minWidth: 220 }}>
                    <div className="row">
                      <span className="badge badge-accent">{l.id}</span>
                      <strong style={{ fontSize: '1.1rem' }}>{l.title}</strong>
                      {isPlaced && <span className="badge badge-ok tiny">내 강좌</span>}
                      {p.percent === 100 && <span className="badge badge-ok tiny">수료</span>}
                    </div>
                    <p className="small dim" style={{ margin: 0 }}><RichText text={l.promise} /></p>
                  </div>
                  <div className="stack stack-4" style={{ width: 150, flexShrink: 0 }}>
                    <div className="bar"><span style={{ width: `${p.percent}%` }} /></div>
                    <span className="tiny muted" style={{ textAlign: 'right' }}>
                      {p.done}/{p.total}차시
                    </span>
                  </div>
                </div>
                <div className="row tiny muted" style={{ gap: 12 }}>
                  <span>{l.collegeEquivalent}</span>
                  <span>· {l.weeks}주 · 주 {l.hoursPerWeek}시간</span>
                  <span>· 차시 {lessons.length}개</span>
                </div>
              </Link>
            );
          })}
        </div>
      </section>
    </div>
  );
}
