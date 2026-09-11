import { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  MODULE_BY_ID, LEVEL_BY_ID, nextModule, prevModule,
  tunesOfModule, albumsOfModule, videosOfModule,
} from '../data';
import { useApp } from '../state';
import { SKILL_AXIS_LABEL } from '../data/types';
import Prose from '../components/Prose';
import ChordInspector from '../components/ChordInspector';
import ReviewCard from '../components/ReviewCard';
import DrillCard from '../components/DrillCard';
import VideoCard from '../components/VideoCard';

export default function ModulePage() {
  const { moduleId } = useParams();
  const { state, toggleModuleComplete } = useApp();
  const mod = moduleId ? MODULE_BY_ID.get(moduleId) : undefined;
  const [openExample, setOpenExample] = useState<string | null>(null);

  if (!mod) {
    return <div className="stack stack-16"><h1>없는 모듈입니다</h1><Link className="btn" to="/curriculum">커리큘럼으로</Link></div>;
  }

  const level = LEVEL_BY_ID.get(mod.levelId);
  const done = state.completedModules.includes(mod.id);
  const tunes = tunesOfModule(mod.id);
  const albums = albumsOfModule(mod.id);
  const videos = videosOfModule(mod.id);
  const next = nextModule(mod.id);
  const prev = prevModule(mod.id);

  return (
    <div className="stack stack-32">
      <header className="stack stack-12">
        {level && <div className="level-strip" style={{ background: level.accentColor }} />}
        <div className="row">
          <Link to={`/curriculum/${mod.levelId}`} className="badge badge-accent" style={{ textDecoration: 'none' }}>
            {mod.levelId} {level?.title}
          </Link>
          <span className="tiny muted mono">모듈 {String(mod.order).padStart(2, '0')}</span>
          <span className="tiny muted">약 {mod.estMinutes}분</span>
        </div>
        <h1 style={{ margin: 0 }}>{mod.title}</h1>
        <p className="tiny muted" style={{ margin: 0 }}>{mod.titleEn}</p>
        <p className="lead" style={{ maxWidth: '60ch' }}>{mod.summary}</p>
        <div className="chips">
          {mod.axis.map((a) => <span key={a} className="badge tiny">{SKILL_AXIS_LABEL[a]}</span>)}
        </div>
      </header>

      <section className="panel stack stack-8">
        <div className="eyebrow">이 모듈을 마치면</div>
        <ul className="small" style={{ margin: 0 }}>
          {mod.objectives.map((o, i) => <li key={i}>{o}</li>)}
        </ul>
        {mod.requires && mod.requires.length > 0 && (
          <p className="tiny muted" style={{ margin: '6px 0 0' }}>
            선수 모듈: {mod.requires.map((r, i) => {
              const pm = MODULE_BY_ID.get(r);
              return <span key={r}>{i > 0 && ', '}{pm ? <Link to={`/module/${r}`}>{pm.title}</Link> : r}</span>;
            })}
          </p>
        )}
      </section>

      {/* ───── 개념 ───── */}
      {mod.concepts.map((c) => (
        <section key={c.id} className="stack stack-16">
          <h2>{c.title} {c.titleEn && <span className="tiny muted" style={{ fontWeight: 400 }}>{c.titleEn}</span>}</h2>
          <Prose text={c.body} />

          {c.examples && c.examples.length > 0 && (
            <div className="stack stack-12">
              {c.examples.map((ex, i) => {
                const key = `${c.id}-${i}`;
                const open = openExample === key;
                return (
                  <div key={key} className="card stack stack-8">
                    <div className="row-between">
                      <div className="stack stack-4">
                        <strong className="small">{ex.label}</strong>
                        <div className="row" style={{ gap: 6 }}>
                          {ex.chords.map((ch, j) => (
                            <span key={j} className="badge mono">{ch}</span>
                          ))}
                        </div>
                      </div>
                      <button className="btn btn-sm" onClick={() => setOpenExample(open ? null : key)}>
                        {open ? '닫기' : '건반에서 보기'}
                      </button>
                    </div>
                    {ex.caption && <p className="tiny dim" style={{ margin: 0 }}>{ex.caption}</p>}
                    {open && (
                      <div className="stack stack-12">
                        {ex.chords.map((ch, j) => (
                          <div key={j} className="stack stack-8">
                            <div className="row">
                              <span className="badge badge-accent mono">{ch}</span>
                              <span className="tiny muted">{j + 1}/{ex.chords.length}</span>
                            </div>
                            <ChordInspector
                              symbol={ch}
                              keyOf={ex.key}
                              nextSymbol={ex.chords[j + 1]}
                              voicingStyle={ex.voicing ?? 'shell-a'}
                            />
                          </div>
                        ))}
                        <Link className="btn btn-sm" to={`/lab/progression?prog=${encodeURIComponent(ex.chords.join('|'))}${ex.key ? `&key=${encodeURIComponent(ex.key)}` : ''}`}>
                          이 진행을 랩에서 반주와 함께 연습하기 →
                        </Link>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}

          {c.pitfalls && c.pitfalls.length > 0 && (
            <div className="note note-warn stack stack-4">
              <strong>여기서 대부분 이렇게 틀립니다</strong>
              <ul className="small" style={{ margin: 0 }}>
                {c.pitfalls.map((p, i) => <li key={i}>{p}</li>)}
              </ul>
            </div>
          )}

          <details className="small">
            <summary className="tiny muted" style={{ cursor: 'pointer' }}>출처 {c.sources.length}건</summary>
            <ul className="tiny dim" style={{ marginTop: 8 }}>
              {c.sources.map((s, i) => (
                <li key={i}>{s.citation}{s.note && <span className="muted"> — {s.note}</span>}</li>
              ))}
            </ul>
          </details>
        </section>
      ))}

      {/* ───── 드릴 ───── */}
      <section className="stack stack-16">
        <h2>연습 드릴 {mod.drills.length}개</h2>
        <p className="small dim" style={{ margin: 0, maxWidth: '58ch' }}>
          드릴을 마치면 기록하세요. 숙련 판정은 <strong>목표 템포 · 무오류 · 날짜가 다른 세션의 재현</strong>
          세 가지를 동시에 봅니다. 하루에 몰아쳐서는 통과할 수 없습니다.
        </p>
        {mod.drills.map((d) => <DrillCard key={d.id} drill={d} />)}
      </section>

      {/* ───── 레퍼토리 · 청음 · 영상 ───── */}
      {tunes.length > 0 && (
        <section className="stack stack-12">
          <h2>이 개념으로 연주할 곡</h2>
          <div className="grid grid-3">
            {tunes.map((t) => (
              <Link key={t.id} to={`/tunes/${t.id}`} className="card card-link card-tight stack stack-4">
                <strong className="small">{t.title}</strong>
                <span className="tiny muted">{t.key} · {t.form} · 난이도 {t.difficulty}</span>
                <p className="tiny dim" style={{ margin: 0 }}>{t.teaches[0]}</p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {albums.length > 0 && (
        <section className="stack stack-12">
          <h2>필청</h2>
          <div className="stack stack-8">
            {albums.map((a) => {
              const note = a.trackNotes.find((n) => n.moduleId === mod.id) ?? a.trackNotes[0];
              return (
                <div key={a.id} className="card card-tight stack stack-4">
                  <div className="row-between">
                    <strong className="small">{a.title}</strong>
                    <span className="tiny muted">{a.pianist} · {a.year}</span>
                  </div>
                  {note && (
                    <p className="small dim" style={{ margin: 0 }}>
                      <span className="badge tiny">{note.track}{note.at ? ` ${note.at}` : ''}</span>{' '}
                      {note.listenFor}
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {videos.length > 0 && (
        <section className="stack stack-12">
          <h2>영상 강의</h2>
          <div className="grid grid-2">
            {videos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </section>
      )}

      {/* ───── 평가 ───── */}
      <section className="card stack stack-12">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>통과 기준</h2>
        <ul className="small" style={{ margin: 0 }}>
          {mod.assessment.criteria.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
        <div className="eyebrow" style={{ marginTop: 6 }}>실기 과제</div>
        <p className="small dim" style={{ margin: 0 }}>{mod.assessment.performanceTask}</p>
        <div className="eyebrow" style={{ marginTop: 6 }}>자가 점검</div>
        <ul className="small dim" style={{ margin: 0 }}>
          {mod.assessment.selfCheck.map((c, i) => <li key={i}>{c}</li>)}
        </ul>
      </section>

      <ReviewCard review={mod.review} />

      {/* ───── 다음 행동 ───── */}
      <section className="panel row-between">
        <button className={`btn ${done ? '' : 'btn-primary'}`} onClick={() => toggleModuleComplete(mod.id)}>
          {done ? '✓ 완료 표시됨 — 해제' : '이 모듈 완료로 표시'}
        </button>
        <div className="btn-row">
          {prev && <Link className="btn btn-sm" to={`/module/${prev.id}`}>← {prev.title}</Link>}
          {next && <Link className="btn btn-sm btn-primary" to={`/module/${next.id}`}>{next.title} →</Link>}
        </div>
      </section>
    </div>
  );
}
