import { useParams, Link } from 'react-router-dom';
import { LEVELS, MODULES, tunesOfLevel, albumsOfLevel } from '../data';
import { useApp } from '../state';
import { SKILL_AXIS_LABEL, type SkillAxis } from '../data/types';
import { RichText } from '../components/Prose';

export default function LevelPage() {
  const { levelId } = useParams();
  const { state } = useApp();
  const level = LEVELS.find((l) => l.id === levelId);

  if (!level) return <div className="stack stack-16"><h1>없는 레벨입니다</h1><Link className="btn" to="/curriculum">커리큘럼으로</Link></div>;

  const mods = MODULES.filter((m) => m.levelId === level.id);
  const tunes = tunesOfLevel(level.id);
  const albums = albumsOfLevel(level.id);
  const done = mods.filter((m) => state.completedModules.includes(m.id)).length;

  return (
    <div className="stack stack-32">
      <header className="stack stack-12">
        <div className="level-strip" style={{ background: level.accentColor }} />
        <div className="row">
          <span className="badge badge-accent">{level.id}</span>
          <span className="tiny muted">{level.collegeEquivalent}</span>
        </div>
        <h1 style={{ margin: 0 }}>{level.title}</h1>
        <p className="tiny muted" style={{ margin: 0 }}>{level.titleEn}</p>
        <p className="lead" style={{ maxWidth: '60ch' }}><RichText text={level.promise} /></p>
        <p className="dim" style={{ maxWidth: '62ch' }}><RichText text={level.description} /></p>
        <div className="bar" style={{ maxWidth: 360 }}>
          <span style={{ width: `${mods.length ? (done / mods.length) * 100 : 0}%` }} />
        </div>
        <span className="tiny muted">{done}/{mods.length} 모듈 완료 · {level.weeks}주 · 주 {level.hoursPerWeek}시간</span>
      </header>

      <div className="grid grid-2">
        <section className="card stack stack-8">
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>들어오기 전에</h2>
          <ul className="small dim" style={{ margin: 0 }}>
            {level.prerequisites.map((p, i) => <li key={i}><RichText text={p} /></li>)}
          </ul>
          <div className="eyebrow" style={{ marginTop: 8 }}>대응 과정</div>
          <div className="chips">
            {level.berkleeAlignment.map((b, i) => <span key={i} className="badge tiny">{b}</span>)}
          </div>
        </section>

        <section className="card stack stack-8">
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>수료 기준 (Jury)</h2>
          <p className="tiny muted" style={{ margin: 0 }}>전부 충족해야 다음 레벨로 넘어갑니다.</p>
          <ul className="small" style={{ margin: 0 }}>
            {level.exitCriteria.map((c, i) => <li key={i}><RichText text={c} /></li>)}
          </ul>
        </section>
      </div>

      <section className="card stack stack-12">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>이 레벨의 목표 숙련도</h2>
        <div className="stack stack-8">
          {(Object.keys(SKILL_AXIS_LABEL) as SkillAxis[]).map((ax) => {
            const target = level.targetSkills[ax] ?? 0;
            if (!target) return null;
            return (
              <div key={ax} className="row" style={{ gap: 10 }}>
                <span className="small" style={{ width: 64, flexShrink: 0 }}>{SKILL_AXIS_LABEL[ax]}</span>
                <div className="bar" style={{ flex: 1 }}><span style={{ width: `${target}%` }} /></div>
                <span className="tiny muted mono" style={{ width: 34, textAlign: 'right' }}>{target}</span>
              </div>
            );
          })}
        </div>
      </section>

      <section className="stack stack-16">
        <h2>모듈 {mods.length}개</h2>
        <div className="stack stack-12">
          {mods.map((m) => (
            <Link key={m.id} to={`/module/${m.id}`} className="card card-link stack stack-8">
              <div className="row-between">
                <div className="row">
                  <span className="badge mono tiny">{String(m.order).padStart(2, '0')}</span>
                  <strong>{m.title}</strong>
                </div>
                {state.completedModules.includes(m.id) && <span className="badge badge-ok">완료</span>}
              </div>
              <p className="small dim" style={{ margin: 0 }}><RichText text={m.summary} /></p>
              <div className="row tiny muted" style={{ gap: 10 }}>
                <span>개념 {m.concepts.length}</span>
                <span>드릴 {m.drills.length}</span>
                <span>레퍼토리 {m.repertoire.length}</span>
                <span>필청 {m.listening.length}</span>
                <span>{m.estMinutes}분</span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {tunes.length > 0 && (
        <section className="stack stack-12">
          <h2>이 레벨의 레퍼토리</h2>
          <div className="chips">
            {tunes.map((t) => (
              <Link key={t.id} to={`/tunes/${t.id}`} className="chip">{t.title} <span className="muted">· {t.key}</span></Link>
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section className="stack stack-12">
          <h2>이 레벨의 필청</h2>
          <div className="grid grid-3">
            {albums.slice(0, 6).map((a) => (
              <Link key={a.id} to="/listening" className="card card-link card-tight stack stack-4">
                {a.priority === 1 && <span className="badge badge-accent tiny">최우선</span>}
                <strong className="small">{a.title}</strong>
                <span className="tiny muted">{a.pianist} · {a.year}</span>
              </Link>
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
