import { useState, useCallback, useEffect, useRef } from 'react';
import { PRACTICE_PARAMETERS, TEACHING_METHODS } from '../data';
import { useApp } from '../state';
import { RichText } from './Prose';

/**
 * 매개변수 연습 설계기 (Hal Crook 계열)
 * ---------------------------------------------------------------------------
 * 즉흥 연습이 흐지부지되는 가장 흔한 이유는 **한 번에 전부 잘하려 하기** 때문이다.
 * 한 코러스에 파라미터를 하나만 고정해 두면 귀가 그 하나에 집중하고,
 * 그 제약이 역설적으로 아이디어를 만든다.
 */
export default function PracticeDesigner() {
  const { logSession } = useApp();
  const [picked, setPicked] = useState<{ paramId: string; value: string }[]>([]);
  const [count, setCount] = useState(1);
  const [seconds, setSeconds] = useState(0);
  const [running, setRunning] = useState(false);
  const timer = useRef<number | null>(null);

  const crook = TEACHING_METHODS.find((m) => m.id === 'pm-crook-parameters');

  useEffect(() => () => { if (timer.current !== null) window.clearInterval(timer.current); }, []);

  const roll = useCallback(() => {
    if (!PRACTICE_PARAMETERS.length) return;
    const pool = [...PRACTICE_PARAMETERS];
    const out: { paramId: string; value: string }[] = [];
    for (let i = 0; i < Math.min(count, pool.length); i++) {
      const idx = Math.floor(Math.random() * pool.length);
      const p = pool.splice(idx, 1)[0];
      out.push({ paramId: p.id, value: p.values[Math.floor(Math.random() * p.values.length)] });
    }
    setPicked(out);
    setSeconds(0);
  }, [count]);

  const toggleTimer = () => {
    if (running) {
      if (timer.current !== null) window.clearInterval(timer.current);
      timer.current = null;
      setRunning(false);
    } else {
      timer.current = window.setInterval(() => setSeconds((s) => s + 1), 1000);
      setRunning(true);
    }
  };

  const mm = String(Math.floor(seconds / 60)).padStart(2, '0');
  const ss = String(seconds % 60).padStart(2, '0');

  if (!PRACTICE_PARAMETERS.length) {
    return <div className="note note-warn">연습 파라미터 데이터가 아직 없습니다.</div>;
  }

  return (
    <div className="stack stack-16">
      <div className="note small">
        <strong>한 번에 하나만.</strong> 즉흥 연습이 흐지부지되는 가장 흔한 이유는 한 코러스에서
        전부 잘하려 하기 때문입니다. 파라미터를 하나만 고정하면 귀가 그 하나에 붙고,
        그 제약이 오히려 아이디어를 만듭니다.
        {crook && <> 이 방식은 <strong>{crook.teacher}</strong>의 연습법에서 가져왔습니다.</>}
      </div>

      <div className="panel stack stack-12">
        <div className="row-between">
          <div className="row">
            <label htmlFor="pcount" className="tiny muted">동시에 고정할 파라미터</label>
            <select id="pcount" value={count} onChange={(e) => setCount(Number(e.target.value))} style={{ width: 'auto' }}>
              <option value={1}>1개 (권장)</option>
              <option value={2}>2개</option>
              <option value={3}>3개 (고급)</option>
            </select>
          </div>
          <button className="btn btn-primary" onClick={roll}>
            {picked.length ? '다시 뽑기' : '이번 코러스의 제약 뽑기'}
          </button>
        </div>

        {picked.length > 0 && (
          <div className="stack stack-12">
            {picked.map(({ paramId, value }) => {
              const p = PRACTICE_PARAMETERS.find((x) => x.id === paramId);
              if (!p) return null;
              return (
                <div key={paramId} className="sunken stack stack-4">
                  <div className="row-between">
                    <span className="eyebrow">{p.label}</span>
                    <span className="tiny muted">{p.labelEn}</span>
                  </div>
                  <strong style={{ fontSize: '1.15rem' }}>{value}</strong>
                  <p className="tiny dim" style={{ margin: 0 }}><RichText text={p.description} /></p>
                </div>
              );
            })}

            <div className="row-between">
              <div className="row">
                <button className="btn" onClick={toggleTimer} aria-pressed={running}>
                  {running ? '■ 멈춤' : '▶ 타이머'}
                </button>
                <span className="mono" style={{ fontSize: '1.3rem', fontWeight: 700 }}>{mm}:{ss}</span>
              </div>
              {seconds >= 60 && (
                <button
                  className="btn btn-sm"
                  onClick={() => {
                    logSession(Math.round(seconds / 60), `매개변수 연습 — ${picked.map((p) => p.value).join(', ')}`);
                    setSeconds(0);
                    if (timer.current !== null) { window.clearInterval(timer.current); timer.current = null; }
                    setRunning(false);
                  }}
                >
                  {Math.round(seconds / 60)}분 연습 기록
                </button>
              )}
            </div>
          </div>
        )}
      </div>

      <div className="stack stack-12">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>파라미터 {PRACTICE_PARAMETERS.length}종</h2>
        <div className="grid grid-2">
          {PRACTICE_PARAMETERS.map((p) => (
            <div key={p.id} className="card card-tight stack stack-4">
              <div className="row-between">
                <strong className="small">{p.label}</strong>
                <span className="tiny muted">{p.labelEn}</span>
              </div>
              <p className="tiny dim" style={{ margin: 0 }}><RichText text={p.description} /></p>
              <div className="chips">
                {p.values.map((v, i) => <span key={i} className="badge tiny">{v}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
