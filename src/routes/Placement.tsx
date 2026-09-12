import { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { PLACEMENT, LEVELS, lessonsOfCourse } from '../data';
import { useApp } from '../state';
import { SKILL_AXIS_LABEL, type LevelId } from '../data/types';
import { RichText } from '../components/Prose';

const LEVEL_ORDER: LevelId[] = ['L0', 'L1', 'L2', 'L3', 'L4', 'L5', 'L6', 'L7', 'L8'];

export default function Placement() {
  const { state, update } = useApp();
  const [idx, setIdx] = useState(0);
  const [answers, setAnswers] = useState<Record<string, number>>({});
  const [done, setDone] = useState(false);

  const q = PLACEMENT[idx];
  const total = PLACEMENT.length;

  const result = useMemo(() => {
    // 각 문항은 signals 레벨을 가리킨다. 맞힌 문항 중 가장 높은 레벨의 "직전"에 배정한다.
    const reached: LevelId[] = [];
    for (const question of PLACEMENT) {
      const score = answers[question.id];
      if (score === undefined) continue;
      if (question.kind === 'choice' ? score === 1 : score >= 2) reached.push(question.signals);
    }
    if (!reached.length) return { level: 'L0' as LevelId, confident: false };
    const highest = reached.reduce((a, b) => (LEVEL_ORDER.indexOf(a) > LEVEL_ORDER.indexOf(b) ? a : b));
    // 도달한 최고 레벨 = 이미 할 수 있는 것. 학습은 그 다음 레벨부터.
    const i = Math.min(LEVEL_ORDER.indexOf(highest) + 1, LEVEL_ORDER.length - 1);
    return { level: LEVEL_ORDER[i], confident: reached.length >= 5 };
  }, [answers]);

  const answer = (value: number) => {
    setAnswers((a) => ({ ...a, [q.id]: value }));
  };

  const next = () => {
    if (idx < total - 1) setIdx(idx + 1);
    else {
      setDone(true);
      update((s) => ({ ...s, placedLevel: result.level, placementAnswers: answers }));
    }
  };

  if (done) {
    const level = LEVELS.find((l) => l.id === result.level)!;
    const firstLesson = lessonsOfCourse(result.level)[0];
    return (
      <div className="stack stack-24">
        <header className="stack stack-12">
          <span className="eyebrow">배치 결과</span>
          <h1 style={{ margin: 0 }}>{level.id} · {level.title}</h1>
          <p className="lead"><RichText text={level.promise} /></p>
        </header>
        <div className="card stack stack-12">
          <div className="level-strip" style={{ background: level.accentColor }} />
          <p className="small dim" style={{ margin: 0 }}><RichText text={level.description} /></p>
          <div className="eyebrow">이 레벨의 수료 기준</div>
          <ul className="small" style={{ margin: 0 }}>
            {level.exitCriteria.map((c, i) => <li key={i}><RichText text={c} /></li>)}
          </ul>
          {!result.confident && (
            <div className="note small">
              응답이 적어 배정 신뢰도가 낮습니다. 한 레벨 아래부터 훑어보고 쉬우면 건너뛰세요.
              <strong> 레벨을 건너뛰는 것은 자유지만, 선수 모듈 없이 들어가면 대개 3주 안에 막힙니다.</strong>
            </div>
          )}
          <div className="btn-row">
            {firstLesson && <Link className="btn btn-primary" to={firstLesson.path}>1차시 시작하기</Link>}
            <Link className="btn" to={`/course/${level.id}`}>강좌 목차 보기</Link>
            <button className="btn btn-ghost" onClick={() => { setDone(false); setIdx(0); setAnswers({}); }}>다시 보기</button>
          </div>
        </div>
      </div>
    );
  }

  if (!q) {
    return <div className="stack stack-16"><h1>배치고사</h1><p className="muted">문항을 불러오지 못했습니다.</p></div>;
  }

  const answered = answers[q.id] !== undefined;

  return (
    <div className="stack stack-24">
      <header className="stack stack-12">
        <span className="eyebrow">Placement</span>
        <h1 style={{ margin: 0 }}>배치고사</h1>
        <p className="lead" style={{ maxWidth: '54ch' }}>
          점수를 매기려는 게 아니라 <strong>어디서부터 시작할지</strong>를 정하기 위한 것입니다.
          모르면 모른다고 고르세요. 그게 정확한 배정으로 이어집니다.
        </p>
        <div className="bar"><span style={{ width: `${((idx + 1) / total) * 100}%` }} /></div>
        <span className="tiny muted">{idx + 1} / {total}</span>
      </header>

      <section className="card stack stack-16">
        <div className="row">
          <span className="badge tiny">{SKILL_AXIS_LABEL[q.axis]}</span>
          <span className="badge tiny">{q.kind === 'choice' ? '객관식' : '자기 보고'}</span>
        </div>
        <h2 style={{ margin: 0, fontSize: '1.1rem' }}>{q.prompt}</h2>
        <div className="stack stack-8">
          {q.options.map((o, i) => {
            const value = q.kind === 'choice' ? (o.correct ? 1 : 0) : (o.value ?? 0);
            const chosen = answers[q.id] === value && (answers[q.id] !== undefined);
            return (
              <button key={i} className="btn" style={{ justifyContent: 'flex-start', textAlign: 'left' }}
                aria-pressed={chosen} onClick={() => answer(value)}>
                {o.label}
              </button>
            );
          })}
        </div>
        {answered && (
          <div className="note small"><RichText text={q.explanation} /></div>
        )}
        <div className="row-between">
          <button className="btn btn-ghost btn-sm" disabled={idx === 0} onClick={() => setIdx(idx - 1)}>← 이전</button>
          <button className="btn btn-primary" disabled={!answered} onClick={next}>
            {idx === total - 1 ? '결과 보기' : '다음 →'}
          </button>
        </div>
      </section>

      <p className="tiny muted">
        현재 배정: {state.placedLevel ?? '미배정'} — 언제든 다시 볼 수 있고, 결과는 이 브라우저에만 저장됩니다.
      </p>
    </div>
  );
}
