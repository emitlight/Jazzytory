import { useParams, Link } from 'react-router-dom';
import {
  LEVEL_BY_ID, lessonsOfCourse, courseProgress, tunesOfLevel, albumsOfLevel,
  methodsOfModule, ALL_DRILLS,
} from '../data';
import { useApp } from '../state';
import { SKILL_AXIS_LABEL, type SkillAxis, type LevelId } from '../data/types';
import { RichText } from '../components/Prose';
import { MASTERY_THRESHOLD } from '../lib/mastery';

/** 강좌 홈 — 강의계획서 + 주차별 목차 */
export default function CourseHome() {
  const { levelId } = useParams();
  const { state } = useApp();
  const level = levelId ? LEVEL_BY_ID.get(levelId) : undefined;

  if (!level) {
    return (
      <div className="stack stack-16">
        <h1>없는 강좌입니다</h1>
        <Link className="btn" to="/courses">강의실로</Link>
      </div>
    );
  }

  const lessons = lessonsOfCourse(level.id as LevelId);
  const p = courseProgress(level.id as LevelId, state.completedModules);
  const tunes = tunesOfLevel(level.id as LevelId);
  const albums = albumsOfLevel(level.id as LevelId);
  const drills = ALL_DRILLS.filter((d) => d.levelId === level.id);
  const passedDrills = drills.filter((d) => (state.drills[d.id]?.mastery ?? 0) >= MASTERY_THRESHOLD).length;

  // 주차별로 차시를 묶는다
  const byWeek = new Map<number, typeof lessons>();
  for (const l of lessons) {
    const arr = byWeek.get(l.week) ?? [];
    arr.push(l);
    byWeek.set(l.week, arr);
  }

  return (
    <div className="stack stack-32">
      <header className="stack stack-12">
        <div className="level-strip" style={{ background: level.accentColor }} />
        <nav className="row tiny muted" aria-label="경로">
          <Link to="/courses">강의실</Link><span>›</span><span>{level.id}</span>
        </nav>
        <div className="row">
          <span className="badge badge-accent">{level.id}</span>
          <span className="tiny muted">{level.collegeEquivalent}</span>
        </div>
        <h1 style={{ margin: 0 }}>{level.title}</h1>
        <p className="tiny muted" style={{ margin: 0 }}>{level.titleEn}</p>
        <p className="lead" style={{ maxWidth: '60ch' }}><RichText text={level.promise} /></p>

        <div className="row-between" style={{ gap: 16 }}>
          <div className="stack stack-4" style={{ flex: 1, minWidth: 220, maxWidth: 420 }}>
            <div className="bar"><span style={{ width: `${p.percent}%` }} /></div>
            <span className="tiny muted">
              {p.done}/{p.total}차시 완료 · 드릴 {passedDrills}/{drills.length} 통과
            </span>
          </div>
          {p.resume && (
            <Link className="btn btn-primary btn-lg" to={p.resume.path}>
              {p.done === 0 ? '1차시 시작하기' : '학습 이어하기'} →
            </Link>
          )}
        </div>
      </header>

      {/* ───── 강의계획서 ───── */}
      <section className="stack stack-16">
        <div className="section-head"><h2 style={{ margin: 0 }}>강의계획서</h2></div>

        <div className="panel stack stack-8">
          <div className="eyebrow">개요</div>
          <p className="small" style={{ margin: 0 }}><RichText text={level.description} /></p>
        </div>

        <div className="grid grid-2">
          <div className="card stack stack-8">
            <div className="eyebrow">선수 요건</div>
            <ul className="small dim" style={{ margin: 0 }}>
              {level.prerequisites.map((x, i) => <li key={i}><RichText text={x} /></li>)}
            </ul>
            <div className="eyebrow" style={{ marginTop: 8 }}>대응 과정</div>
            <div className="chips">
              {level.berkleeAlignment.map((b, i) => <span key={i} className="badge tiny">{b}</span>)}
            </div>
          </div>

          <div className="card stack stack-8">
            <div className="eyebrow">수료 기준 (Jury)</div>
            <p className="tiny muted" style={{ margin: 0 }}>전부 충족해야 다음 강좌로 넘어갑니다.</p>
            <ul className="small" style={{ margin: 0 }}>
              {level.exitCriteria.map((c, i) => <li key={i}><RichText text={c} /></li>)}
            </ul>
          </div>
        </div>

        <div className="card stack stack-12">
          <div className="eyebrow">목표 숙련도</div>
          <div className="stack stack-8">
            {(Object.keys(SKILL_AXIS_LABEL) as SkillAxis[]).map((ax) => {
              const target = level.targetSkills[ax] ?? 0;
              if (!target) return null;
              return (
                <div key={ax} className="row" style={{ gap: 10 }}>
                  <span className="small" style={{ width: 64, flexShrink: 0 }}>{SKILL_AXIS_LABEL[ax]}</span>
                  <div className="bar fill"><span style={{ width: `${target}%` }} /></div>
                  <span className="tiny muted mono" style={{ width: 34, textAlign: 'right' }}>{target}</span>
                </div>
              );
            })}
          </div>
        </div>

        <div className="row small muted" style={{ gap: 14 }}>
          <span>{level.weeks}주 · 주 {level.hoursPerWeek}시간</span>
          <span>· 차시 {lessons.length}개</span>
          <span>· 곡 {tunes.length}</span>
          <span>· 필청 {albums.length}장</span>
          <span>· 드릴 {drills.length}</span>
        </div>
      </section>

      {/* ───── 목차 ───── */}
      <section className="stack stack-16">
        <div className="section-head row-between">
          <h2 style={{ margin: 0 }}>목차</h2>
          <span className="tiny muted">차시 하나에 개념·연습·곡·청음·평가가 모두 들어 있습니다</span>
        </div>

        <div className="stack stack-24">
          {[...byWeek.entries()].map(([week, items]) => (
            <div key={week} className="stack stack-8">
              <div className="ls-section-label">{week}주차</div>
              <div className="stack stack-8">
                {items.map((l) => {
                  const done = state.completedModules.includes(l.module.id);
                  const methods = methodsOfModule(l.module.id);
                  return (
                    <Link key={l.module.id} to={l.path} className="card card-link card-tight stack stack-8">
                      <div className="row-between">
                        <div className="row" style={{ flex: 1, minWidth: 200 }}>
                          <span className="badge mono tiny" style={{ flexShrink: 0 }}>
                            {String(l.number).padStart(2, '0')}
                          </span>
                          <strong className="small">{l.module.title}</strong>
                        </div>
                        <div className="row" style={{ flexShrink: 0 }}>
                          <span className="tiny muted">{l.module.estMinutes}분</span>
                          {done
                            ? <span className="badge badge-ok tiny">완료</span>
                            : <span className="badge tiny">미수강</span>}
                        </div>
                      </div>
                      <p className="tiny dim" style={{ margin: 0 }}><RichText text={l.module.summary} /></p>
                      <div className="row tiny muted" style={{ gap: 10 }}>
                        <span>개념 {l.module.concepts.length}</span>
                        <span>드릴 {l.module.drills.length}</span>
                        {methods.length > 0 && <span>교수법 {methods.length}</span>}
                        {l.module.repertoire.length > 0 && <span>곡 {l.module.repertoire.length}</span>}
                        {l.module.listening.length > 0 && <span>필청 {l.module.listening.length}</span>}
                      </div>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      </section>

      {p.resume && (
        <section className="panel row-between">
          <span className="small dim">다음에 할 것 — {p.resume.number}차시 {p.resume.module.title}</span>
          <Link className="btn btn-primary" to={p.resume.path}>시작하기 →</Link>
        </section>
      )}
    </div>
  );
}
