import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { TEACHING_METHODS, LEVELS, modulesOfMethod, CONTENT_STATS, lessonPathOfModule } from '../data';
import { SKILL_AXIS_LABEL, type LevelId } from '../data/types';
import { RichText } from '../components/Prose';

export default function Pedagogy() {
  const [levelFilter, setLevelFilter] = useState<LevelId | 'all'>('all');
  const [open, setOpen] = useState<string | null>(TEACHING_METHODS[0]?.id ?? null);

  const filtered = useMemo(
    () => TEACHING_METHODS.filter((m) => levelFilter === 'all' || m.levels.includes(levelFilter)),
    [levelFilter],
  );

  return (
    <div className="stack stack-32">
      <header className="stack stack-12">
        <span className="eyebrow">Teaching Methods</span>
        <h1 style={{ margin: 0 }}>교수법 {TEACHING_METHODS.length}가지</h1>
        <p className="lead" style={{ maxWidth: '60ch' }}>
          재즈 교육에는 <strong>서로 다른 학파</strong>가 있습니다. 배리 해리스는 화성을 움직임으로 가르쳤고,
          트리스타노는 손보다 목소리를 먼저 시켰고, 갤퍼는 프레이즈가 어디서 <em>끝나는지</em>를 바꿨습니다.
          Jazzytory 는 이 방법들을 커리큘럼 각 모듈에 이식했습니다 — 같은 내용을 어떻게 연습하느냐가
          무엇을 연습하느냐보다 자주 결과를 가릅니다.
        </p>
        <div className="note note-warn small">
          <strong>출처와 한계.</strong> 여기 정리한 것은 각 교육자가 <strong>공개 출판물과 공개 워크숍에서
          가르친 방법</strong>입니다. 그분들이 Jazzytory 를 검수하거나 승인한 것은 아니며, 그런 주장을
          하지 않습니다. 인용은 책·장 수준까지만 하고 확인되지 않은 일화는 싣지 않았습니다.
        </div>
      </header>

      <div className="panel stack stack-8">
        <span className="eyebrow">레벨로 거르기</span>
        <div className="chips">
          <button className="chip" aria-pressed={levelFilter === 'all'} onClick={() => setLevelFilter('all')}>전체</button>
          {LEVELS.map((l) => (
            <button key={l.id} className="chip" aria-pressed={levelFilter === l.id} onClick={() => setLevelFilter(l.id)}>
              {l.id}
            </button>
          ))}
        </div>
        <p className="tiny muted" style={{ margin: 0 }}>
          {CONTENT_STATS.methodApplications}건의 적용이 {CONTENT_STATS.modules}개 모듈에 붙어 있습니다.
        </p>
      </div>

      <div className="stack stack-16">
        {filtered.map((m) => {
          const isOpen = open === m.id;
          const uses = modulesOfMethod(m.id);
          return (
            <article key={m.id} className="card stack stack-12">
              <div className="row-between">
                <div className="stack stack-4" style={{ flex: 1, minWidth: 220 }}>
                  <div className="row">
                    <span className="badge badge-accent">{m.teacher}</span>
                    <span className="tiny muted">{m.era}</span>
                  </div>
                  <h2 style={{ margin: 0, fontSize: '1.18rem' }}>{m.name}</h2>
                  <span className="tiny muted">{m.nameEn}</span>
                </div>
                <button className="btn btn-sm" onClick={() => setOpen(isOpen ? null : m.id)} aria-expanded={isOpen}>
                  {isOpen ? '접기' : '연습 절차 보기'}
                </button>
              </div>

              <p className="lead" style={{ margin: 0, fontSize: '1rem' }}><RichText text={m.thesis} /></p>

              <div className="stack stack-4">
                <div className="eyebrow">이 방법이 고치는 증상</div>
                <ul className="small dim" style={{ margin: 0 }}>
                  {m.fixes.map((f, i) => <li key={i}><RichText text={f} /></li>)}
                </ul>
              </div>

              {isOpen && (
                <div className="stack stack-16">
                  <div className="sunken stack stack-8">
                    <div className="eyebrow">왜 효과가 있는가</div>
                    <p className="small" style={{ margin: 0 }}><RichText text={m.why} /></p>
                  </div>

                  <div className="stack stack-8">
                    <div className="eyebrow">오늘 당장 하는 법</div>
                    <ol className="small" style={{ margin: 0 }}>
                      {m.protocol.map((p, i) => <li key={i} style={{ marginBottom: '.5em' }}><RichText text={p} /></li>)}
                    </ol>
                  </div>

                  {m.caveats.length > 0 && (
                    <div className="note note-warn stack stack-4">
                      <strong>이 방법의 한계</strong>
                      <ul className="small" style={{ margin: 0 }}>
                        {m.caveats.map((c, i) => <li key={i}><RichText text={c} /></li>)}
                      </ul>
                    </div>
                  )}

                  {uses.length > 0 && (
                    <div className="stack stack-8">
                      <div className="eyebrow">이 교수법이 쓰이는 모듈 {uses.length}개</div>
                      <div className="chips">
                        {uses.map(({ module }) => (
                          <Link key={module.id} className="chip" to={lessonPathOfModule(module.id) ?? '/courses'}>
                            {module.levelId} · {module.title}
                          </Link>
                        ))}
                      </div>
                    </div>
                  )}

                  <details>
                    <summary className="tiny muted" style={{ cursor: 'pointer' }}>출처 {m.sources.length}건</summary>
                    <ul className="tiny dim" style={{ marginTop: 8 }}>
                      {m.sources.map((s, i) => (
                        <li key={i}>{s.citation}{s.note && <span className="muted"> — {s.note}</span>}</li>
                      ))}
                    </ul>
                  </details>
                </div>
              )}

              <div className="row" style={{ gap: 6 }}>
                {m.levels.map((l) => <span key={l} className="badge tiny">{l}</span>)}
                {m.axis.map((a) => <span key={a} className="badge tiny">{SKILL_AXIS_LABEL[a]}</span>)}
              </div>
            </article>
          );
        })}
      </div>

      {filtered.length === 0 && <p className="muted">해당 레벨에 배정된 교수법이 없습니다.</p>}
    </div>
  );
}
