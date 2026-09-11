import { Link } from 'react-router-dom';
import { LEVELS, MODULES, CONTENT_STATS } from '../data';
import { useApp } from '../state';
import { REVIEW_STATUS_LABEL } from '../data/types';

export default function Curriculum() {
  const { state } = useApp();

  return (
    <div className="stack stack-32">
      <header className="stack stack-12">
        <span className="eyebrow">Curriculum</span>
        <h1>커리큘럼</h1>
        <p className="lead" style={{ maxWidth: '60ch' }}>
          4년제 재즈피아노 연주 전공 학부 과정을 웹으로 옮긴 {CONTENT_STATS.modules}개 모듈.
          각 레벨은 대학 실기시험(jury)에 준하는 통과 기준을 갖습니다.
          레벨을 건너뛸 수는 있지만, 선수 모듈 없이 들어가면 대부분 3주 안에 막힙니다.
        </p>
      </header>

      {LEVELS.map((level) => {
        const mods = MODULES.filter((m) => m.levelId === level.id);
        const done = mods.filter((m) => state.completedModules.includes(m.id)).length;
        return (
          <section key={level.id} className="stack stack-16">
            <div className="level-strip" style={{ background: level.accentColor }} />
            <div className="row-between">
              <div className="stack stack-4">
                <div className="row">
                  <span className="badge badge-accent">{level.id}</span>
                  <h2 style={{ margin: 0 }}>{level.title}</h2>
                  <span className="tiny muted">{level.titleEn}</span>
                </div>
                <p className="dim small" style={{ margin: 0 }}>{level.promise}</p>
              </div>
              <Link className="btn btn-sm" to={`/curriculum/${level.id}`}>레벨 상세</Link>
            </div>

            <div className="row small muted" style={{ gap: 14 }}>
              <span>{level.collegeEquivalent}</span>
              <span>· {level.weeks}주 · 주 {level.hoursPerWeek}시간</span>
              <span>· {done}/{mods.length} 완료</span>
            </div>

            <div className="grid grid-3">
              {mods.map((m) => {
                const complete = state.completedModules.includes(m.id);
                return (
                  <Link key={m.id} to={`/module/${m.id}`} className="card card-link card-tight stack stack-8">
                    <div className="row-between">
                      <span className="tiny muted mono">{m.levelId}·{String(m.order).padStart(2, '0')}</span>
                      {complete
                        ? <span className="badge badge-ok">완료</span>
                        : <span className="badge tiny">{REVIEW_STATUS_LABEL[m.review.status]}</span>}
                    </div>
                    <strong className="small">{m.title}</strong>
                    <p className="tiny dim" style={{ margin: 0 }}>{m.summary}</p>
                    <div className="row tiny muted" style={{ gap: 8 }}>
                      <span>개념 {m.concepts.length}</span>
                      <span>드릴 {m.drills.length}</span>
                      <span>{m.estMinutes}분</span>
                    </div>
                  </Link>
                );
              })}
            </div>
          </section>
        );
      })}
    </div>
  );
}
