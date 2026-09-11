import { useState } from 'react';
import { Link } from 'react-router-dom';
import type { Drill } from '../data/types';
import { SKILL_AXIS_LABEL } from '../data/types';
import { useApp } from '../state';
import { MASTERY_THRESHOLD, shouldStepBack } from '../lib/mastery';

export default function DrillCard({ drill }: { drill: Drill }) {
  const { state, logDrill } = useApp();
  const st = state.drills[drill.id];
  const mastery = st?.mastery ?? 0;
  const [open, setOpen] = useState(false);
  const [bpm, setBpm] = useState(drill.tempoRange[0]);
  const [minutes, setMinutes] = useState(10);
  const passed = mastery >= MASTERY_THRESHOLD;
  const ref = { id: drill.id, title: drill.title, targetBpm: drill.tempoRange[1] };

  return (
    <div className="card stack stack-12">
      <div className="row-between">
        <div className="stack stack-4" style={{ flex: 1, minWidth: 200 }}>
          <div className="row">
            <strong className="small">{drill.title}</strong>
            {drill.allKeys && <span className="badge tiny">12키</span>}
            {passed && <span className="badge badge-ok tiny">통과</span>}
          </div>
          <div className="row tiny muted" style={{ gap: 8 }}>
            <span className="mono">♩={drill.tempoRange[0]} → {drill.tempoRange[1]}</span>
            <span>· 권장 {drill.days}일</span>
            {drill.axis.map((a) => <span key={a}>· {SKILL_AXIS_LABEL[a]}</span>)}
          </div>
        </div>
        <div className="stack stack-4" style={{ width: 120 }}>
          <div className="bar" aria-label={`숙련도 ${mastery}%`}>
            <span style={{ width: `${mastery}%`, background: passed ? 'var(--ok)' : 'var(--accent)' }} />
          </div>
          <span className="tiny muted" style={{ textAlign: 'right' }}>숙련도 {mastery}%</span>
        </div>
      </div>

      <p className="small dim" style={{ margin: 0, whiteSpace: 'pre-line' }}>{drill.instruction}</p>

      {st && shouldStepBack(st) && (
        <div className="note note-warn small">
          3회 연속 실패했습니다. <strong>템포를 10~15 BPM 낮추고</strong> 한 키만 다시 잡으세요.
          같은 벽에 계속 부딪히는 것은 연습이 아닙니다.
        </div>
      )}

      <div className="btn-row">
        {drill.labLink && <Link className="btn btn-sm" to={drill.labLink}>랩에서 연습 →</Link>}
        <button className="btn btn-sm btn-primary" onClick={() => setOpen((o) => !o)}>
          {open ? '닫기' : '연습 기록하기'}
        </button>
        {st && st.dueDate && (
          <span className="tiny muted" style={{ alignSelf: 'center' }}>다음 복습 권장: {st.dueDate}</span>
        )}
      </div>

      {open && (
        <div className="sunken stack stack-12">
          <div className="row" style={{ gap: 16 }}>
            <div className="field" style={{ minWidth: 150, flex: 1 }}>
              <label htmlFor={`bpm-${drill.id}`}>도달 템포 <span className="mono">{bpm} BPM</span></label>
              <input id={`bpm-${drill.id}`} type="range" min={40} max={Math.max(240, drill.tempoRange[1] + 20)}
                value={bpm} onChange={(e) => setBpm(Number(e.target.value))} />
            </div>
            <div className="field" style={{ minWidth: 110 }}>
              <label htmlFor={`min-${drill.id}`}>연습 시간(분)</label>
              <input id={`min-${drill.id}`} type="number" min={1} max={180}
                value={minutes} onChange={(e) => setMinutes(Number(e.target.value))} />
            </div>
          </div>
          <div className="btn-row">
            <button className="btn btn-primary btn-sm"
              onClick={() => { logDrill(ref, bpm, true, minutes); setOpen(false); }}>
              무오류로 끝냈다
            </button>
            <button className="btn btn-sm"
              onClick={() => { logDrill(ref, bpm, false, minutes); setOpen(false); }}>
              틀린 데가 있었다
            </button>
          </div>
          <p className="tiny muted" style={{ margin: 0 }}>
            정직하게 기록하세요. "틀린 데가 있었다"를 누르면 복습 간격이 줄어들 뿐, 벌점은 없습니다.
          </p>
        </div>
      )}
    </div>
  );
}
