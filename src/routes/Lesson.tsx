import { useState } from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import {
  LEVEL_BY_ID, lessonsOfCourse, lessonAt, adjacentLessons, courseProgress,
  tunesOfModule, albumsOfModule, videosOfModule,
} from '../data';
import { useApp } from '../state';
import { SKILL_AXIS_LABEL, type LevelId } from '../data/types';
import Prose, { RichText } from '../components/Prose';
import ChordInspector from '../components/ChordInspector';
import ReviewCard from '../components/ReviewCard';
import DrillCard from '../components/DrillCard';
import VideoCard from '../components/VideoCard';
import MethodSection from '../components/MethodSection';

/**
 * 차시(Lesson) — LMS 의 한 강의 단원.
 * 이 단원에 필요한 모든 것이 한 페이지에 순서대로 있고, 끝나면 다음 차시로 넘어간다.
 * 학습자가 메뉴를 돌아다니게 만들지 않는 것이 이 화면의 존재 이유다.
 */
export default function Lesson() {
  const { levelId, lessonNo } = useParams();
  const { state, toggleModuleComplete } = useApp();
  const [openExample, setOpenExample] = useState<string | null>(null);
  const [tocOpen, setTocOpen] = useState(false);

  const level = levelId ? LEVEL_BY_ID.get(levelId) : undefined;
  const n = Number(lessonNo);
  const lesson = level && Number.isFinite(n) ? lessonAt(level.id as LevelId, n) : null;

  if (!level) return <Navigate to="/courses" replace />;
  if (!lesson) {
    return (
      <div className="stack stack-16">
        <h1>없는 차시입니다</h1>
        <Link className="btn" to={`/course/${level.id}`}>강좌 목차로</Link>
      </div>
    );
  }

  const mod = lesson.module;
  const lessons = lessonsOfCourse(level.id as LevelId);
  const progress = courseProgress(level.id as LevelId, state.completedModules);
  const { prev, next } = adjacentLessons(mod.id);
  const done = state.completedModules.includes(mod.id);
  const tunes = tunesOfModule(mod.id);
  const albums = albumsOfModule(mod.id);
  const videos = videosOfModule(mod.id);

  let step = 0;
  const stepNo = () => String(++step).padStart(2, '0');

  return (
    <div className="stack stack-32">

      {/* ───── 강좌 크롬 ───── */}
      <div className="panel stack stack-8">
        <nav className="row tiny muted" aria-label="경로">
          <Link to="/courses">강의실</Link><span>›</span>
          <Link to={`/course/${level.id}`}>{level.id} {level.title}</Link><span>›</span>
          <span>{lesson.number}차시</span>
        </nav>
        <div className="row-between">
          <div className="stack stack-4" style={{ flex: 1, minWidth: 200 }}>
            <div className="bar"><span style={{ width: `${progress.percent}%` }} /></div>
            <span className="tiny muted">
              강좌 진도 {progress.done}/{progress.total}차시 · {lesson.week}주차
            </span>
          </div>
          <button className="btn btn-sm" onClick={() => setTocOpen((o) => !o)} aria-expanded={tocOpen}>
            {tocOpen ? '목차 닫기' : '목차 열기'}
          </button>
        </div>

        {tocOpen && (
          <ol className="stack stack-4" style={{ margin: 0, paddingLeft: 0, listStyle: 'none' }}>
            {lessons.map((l) => {
              const isNow = l.module.id === mod.id;
              const isDone = state.completedModules.includes(l.module.id);
              return (
                <li key={l.module.id}>
                  <Link
                    to={l.path}
                    className="row"
                    style={{
                      textDecoration: 'none', padding: '6px 10px', borderRadius: 6,
                      background: isNow ? 'var(--accent-soft)' : 'transparent',
                      color: isNow ? 'var(--accent)' : 'var(--text-2)',
                      fontWeight: isNow ? 700 : 500,
                    }}
                  >
                    <span className="mono tiny" style={{ width: 24 }}>{String(l.number).padStart(2, '0')}</span>
                    <span className="small">{l.module.title}</span>
                    {isDone && <span className="badge badge-ok tiny">✓</span>}
                  </Link>
                </li>
              );
            })}
          </ol>
        )}
      </div>

      {/* ───── 차시 제목 ───── */}
      <header className="stack stack-12">
        <div className="row">
          <span className="badge badge-accent mono">{lesson.number}차시</span>
          <span className="tiny muted">약 {mod.estMinutes}분</span>
          {done && <span className="badge badge-ok tiny">완료</span>}
        </div>
        <h1 style={{ margin: 0 }}>{mod.title}</h1>
        <p className="tiny muted" style={{ margin: 0 }}>{mod.titleEn}</p>
        <p className="lead" style={{ maxWidth: '60ch' }}><RichText text={mod.summary} /></p>
        <div className="chips">
          {mod.axis.map((a) => <span key={a} className="badge tiny">{SKILL_AXIS_LABEL[a]}</span>)}
        </div>
      </header>

      {/* ───── 01 학습 목표 ───── */}
      <section className="panel stack stack-8">
        <div className="section-head"><span className="eyebrow">{stepNo()} 이 차시를 마치면</span></div>
        <ul className="small" style={{ margin: 0 }}>
          {mod.objectives.map((o, i) => <li key={i}><RichText text={o} /></li>)}
        </ul>
        {mod.requires && mod.requires.length > 0 && (
          <p className="tiny muted" style={{ margin: '6px 0 0' }}>
            선수 차시가 있습니다. 막히면 <Link to={`/course/${level.id}`}>목차</Link>에서 앞 차시를 먼저 확인하세요.
          </p>
        )}
      </section>

      {/* ───── 02 개념 ───── */}
      <section className="stack stack-24">
        <div className="section-head"><span className="eyebrow">{stepNo()} 개념</span></div>
        {mod.concepts.map((c) => (
          <div key={c.id} className="stack stack-16">
            <h2 style={{ margin: 0 }}>
              {c.title}{' '}
              {c.titleEn && <span className="tiny muted" style={{ fontWeight: 400 }}>{c.titleEn}</span>}
            </h2>
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
                            {ex.chords.map((ch, j) => <span key={j} className="badge mono">{ch}</span>)}
                          </div>
                        </div>
                        <button className="btn btn-sm" onClick={() => setOpenExample(open ? null : key)}>
                          {open ? '닫기' : '건반에서 보기'}
                        </button>
                      </div>
                      {ex.caption && <p className="tiny dim" style={{ margin: 0 }}><RichText text={ex.caption} /></p>}
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
                          <Link
                            className="btn btn-sm"
                            to={`/lab/progression?prog=${encodeURIComponent(ex.chords.join('|'))}${ex.key ? `&key=${encodeURIComponent(ex.key)}` : ''}`}
                          >
                            이 진행을 반주와 함께 연습하기 →
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
                  {c.pitfalls.map((p, i) => <li key={i}><RichText text={p} /></li>)}
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
          </div>
        ))}
      </section>

      {/* ───── 03 교수법 ───── */}
      <div className="stack stack-8">
        <div className="section-head"><span className="eyebrow">{stepNo()} 연습 방법</span></div>
        <MethodSection moduleId={mod.id} />
      </div>

      {/* ───── 04 드릴 ───── */}
      <section className="stack stack-16">
        <div className="section-head"><span className="eyebrow">{stepNo()} 연습 드릴 {mod.drills.length}개</span></div>
        <p className="small dim" style={{ margin: 0, maxWidth: '58ch' }}>
          드릴을 마치면 기록하세요. 숙련 판정은 <strong>목표 템포 · 무오류 · 날짜가 다른 세션의 재현</strong>
          세 가지를 동시에 봅니다. 하루에 몰아쳐서는 통과할 수 없습니다.
        </p>
        {mod.drills.map((d) => <DrillCard key={d.id} drill={d} />)}
      </section>

      {/* ───── 05 레퍼토리 ───── */}
      {tunes.length > 0 && (
        <section className="stack stack-12">
          <div className="section-head"><span className="eyebrow">{stepNo()} 이 차시의 곡</span></div>
          <div className="grid grid-3">
            {tunes.map((t) => (
              <Link key={t.id} to={`/tunes/${t.id}`} className="card card-link card-tight stack stack-4">
                <strong className="small">{t.title}</strong>
                <span className="tiny muted">{t.key} · {t.form} · 난이도 {t.difficulty}</span>
                <p className="tiny dim" style={{ margin: 0 }}><RichText text={t.teaches[0]} /></p>
              </Link>
            ))}
          </div>
        </section>
      )}

      {/* ───── 06 필청 ───── */}
      {albums.length > 0 && (
        <section className="stack stack-12">
          <div className="section-head"><span className="eyebrow">{stepNo()} 필청</span></div>
          <div className="stack stack-8">
            {albums.map((a) => {
              const note = a.trackNotes.find((x) => x.moduleId === mod.id) ?? a.trackNotes[0];
              return (
                <div key={a.id} className="card card-tight stack stack-4">
                  <div className="row-between">
                    <strong className="small">{a.title}</strong>
                    <span className="tiny muted">{a.pianist} · {a.year}</span>
                  </div>
                  {note && (
                    <p className="small dim" style={{ margin: 0 }}>
                      <span className="badge tiny">{note.track}{note.at ? ` ${note.at}` : ''}</span>{' '}
                      <RichText text={note.listenFor} />
                    </p>
                  )}
                </div>
              );
            })}
          </div>
        </section>
      )}

      {/* ───── 07 영상 ───── */}
      {videos.length > 0 && (
        <section className="stack stack-12">
          <div className="section-head"><span className="eyebrow">{stepNo()} 영상 강의</span></div>
          <div className="grid grid-2">
            {videos.map((v) => <VideoCard key={v.id} video={v} />)}
          </div>
        </section>
      )}

      {/* ───── 08 평가 ───── */}
      <section className="card stack stack-12">
        <div className="section-head"><span className="eyebrow">{stepNo()} 통과 기준</span></div>
        <ul className="small" style={{ margin: 0 }}>
          {mod.assessment.criteria.map((c, i) => <li key={i}><RichText text={c} /></li>)}
        </ul>
        <div className="eyebrow" style={{ marginTop: 6 }}>실기 과제</div>
        <p className="small dim" style={{ margin: 0 }}><RichText text={mod.assessment.performanceTask} /></p>
        <div className="eyebrow" style={{ marginTop: 6 }}>자가 점검</div>
        <ul className="small dim" style={{ margin: 0 }}>
          {mod.assessment.selfCheck.map((c, i) => <li key={i}><RichText text={c} /></li>)}
        </ul>
      </section>

      {/* ───── 09 검수 ───── */}
      <div className="stack stack-8">
        <div className="section-head"><span className="eyebrow">{stepNo()} 검수 기록</span></div>
        <ReviewCard review={mod.review} />
      </div>

      {/* ───── 차시 마무리 ───── */}
      <section className="card card-feature stack stack-12">
        <div className="row-between">
          <div className="stack stack-4">
            <strong>이 차시를 마쳤나요?</strong>
            <span className="tiny muted">
              통과 기준을 충족했을 때만 체크하세요. 진도는 이 브라우저에 저장됩니다.
            </span>
          </div>
          <button
            className={`btn btn-lg ${done ? '' : 'btn-primary'}`}
            onClick={() => toggleModuleComplete(mod.id)}
          >
            {done ? '✓ 완료 표시됨 — 해제' : '이 차시 완료'}
          </button>
        </div>

        <div className="row-between" style={{ gap: 10 }}>
          {prev
            ? <Link className="btn btn-sm" to={prev.path}>← {prev.number}차시 {prev.module.title}</Link>
            : <span />}
          <Link className="btn btn-sm btn-ghost" to={`/course/${level.id}`}>목차</Link>
          {next
            ? <Link className="btn btn-sm btn-primary" to={next.path}>{next.module.title} →</Link>
            : <Link className="btn btn-sm btn-primary" to="/courses">전 과정 수료 · 강의실로 →</Link>}
        </div>
      </section>
    </div>
  );
}
