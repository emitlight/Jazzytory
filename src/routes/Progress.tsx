import { useMemo, useState } from 'react';
import { Link } from 'react-router-dom';
import { LEVELS, MODULES, ALL_DRILLS, DRILL_BY_ID, DRILL_AXIS_MAP, TUNES } from '../data';
import { useApp } from '../state';
import { axisScores, dueDrills, practiceStreak, buildSession, MASTERY_THRESHOLD } from '../lib/mastery';
import { practiceDates, totalPracticeMinutes, exportState, importState } from '../lib/storage';
import { SKILL_AXIS_LABEL, type SkillAxis } from '../data/types';
import DrillCard from '../components/DrillCard';

export default function Progress() {
  const { state, update, reset } = useApp();
  const [sessionMinutes, setSessionMinutes] = useState(30);
  const [importText, setImportText] = useState('');
  const [importMsg, setImportMsg] = useState('');

  const scores = useMemo(() => axisScores(state.drills, DRILL_AXIS_MAP), [state.drills]);
  const due = useMemo(() => dueDrills(state.drills), [state.drills]);
  const streak = practiceStreak(practiceDates(state));
  const minutes = totalPracticeMinutes(state);

  const session = useMemo(() => {
    const pool = (due.length ? due : ALL_DRILLS.filter((d) =>
      (state.drills[d.id]?.mastery ?? 0) < MASTERY_THRESHOLD
      && (!state.placedLevel || d.levelId <= (state.placedLevel ?? 'L8'))).slice(0, 10).map((d) => d.id))
      .map((id) => DRILL_BY_ID.get(id))
      .filter((d): d is NonNullable<typeof d> => !!d)
      .map((d) => ({ drillId: d.id, minutes: 15, axis: d.axis }));
    return buildSession(pool, sessionMinutes);
  }, [due, state.drills, state.placedLevel, sessionMinutes]);

  const recent = [...state.practiceLog].reverse().slice(0, 12);

  return (
    <div className="stack stack-32">
      <header className="stack stack-12">
        <span className="eyebrow">My Progress</span>
        <h1 style={{ margin: 0 }}>내 진도</h1>
        <p className="lead" style={{ maxWidth: '58ch' }}>
          숙련도는 <strong>목표 템포 · 무오류 · 날짜가 다른 세션에서의 재현</strong> 세 가지를
          동시에 보고 계산합니다. 하루에 몰아치면 숫자가 오르지 않습니다.
        </p>
      </header>

      <section className="grid grid-4">
        <Stat label="연습 스트릭" value={`${streak}일`} />
        <Stat label="누적 연습" value={`${Math.round(minutes / 60)}시간 ${minutes % 60}분`} />
        <Stat label="완료 모듈" value={`${state.completedModules.length} / ${MODULES.length}`} />
        <Stat label="내 레퍼토리" value={`${state.favoriteTunes.length} / ${TUNES.length}곡`} />
      </section>

      <section className="card stack stack-16">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>8축 숙련도</h2>
        <div className="stack stack-8">
          {scores.map((s) => {
            const target = state.placedLevel
              ? LEVELS.find((l) => l.id === state.placedLevel)?.targetSkills[s.axis as SkillAxis] ?? 0
              : 0;
            return (
              <div key={s.axis} className="row" style={{ gap: 10 }}>
                <span className="small" style={{ width: 64, flexShrink: 0 }}>{SKILL_AXIS_LABEL[s.axis]}</span>
                <div className="bar" style={{ flex: 1, position: 'relative' }}>
                  <span style={{ width: `${s.value}%` }} />
                  {target > 0 && (
                    <span aria-hidden="true" style={{
                      position: 'absolute', left: `${target}%`, top: -2, bottom: -2, width: 2,
                      background: 'var(--text-3)', borderRadius: 0,
                    }} />
                  )}
                </div>
                <span className="tiny muted mono" style={{ width: 56, textAlign: 'right' }}>
                  {s.value}{target ? ` / ${target}` : ''}
                </span>
              </div>
            );
          })}
        </div>
        <p className="tiny muted" style={{ margin: 0 }}>
          세로 눈금은 현재 배정 레벨의 목표치입니다. 드릴을 기록해야 숫자가 움직입니다.
        </p>
      </section>

      <section className="card stack stack-12">
        <div className="row-between">
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>오늘의 연습 세션</h2>
          <div className="row">
            <label htmlFor="sm" className="tiny muted">총 시간</label>
            <select id="sm" value={sessionMinutes} onChange={(e) => setSessionMinutes(Number(e.target.value))} style={{ width: 'auto' }}>
              {[20, 30, 45, 60, 90].map((m) => <option key={m} value={m}>{m}분</option>)}
            </select>
          </div>
        </div>
        <p className="small dim" style={{ margin: 0 }}>
          한 드릴을 20분 연속하는 것보다 <strong>여러 드릴을 5분씩 섞는 편</strong>이 전이가 좋습니다(인터리빙).
          그래서 세션은 일부러 잘게 쪼개 섞습니다.
        </p>
        {session.length === 0 ? (
          <p className="muted small">
            아직 기록이 없습니다. <Link to="/curriculum">커리큘럼</Link>에서 모듈을 열고 드릴을 시작하세요.
          </p>
        ) : (
          <ol className="small" style={{ margin: 0 }}>
            {session.map((s, i) => {
              const d = DRILL_BY_ID.get(s.drillId);
              return (
                <li key={i}>
                  <strong>{s.minutes}분</strong> — {d?.title}{' '}
                  <Link className="tiny" to={`/module/${d?.moduleId}`}>모듈 열기</Link>
                </li>
              );
            })}
          </ol>
        )}
      </section>

      {due.length > 0 && (
        <section className="stack stack-12">
          <h2>복습 대기 {due.length}개</h2>
          {due.slice(0, 8).map((id) => {
            const d = DRILL_BY_ID.get(id);
            return d ? <DrillCard key={id} drill={d} /> : null;
          })}
        </section>
      )}

      <section className="stack stack-12">
        <h2>레벨별 진행</h2>
        <div className="table-scroll">
          <table className="data">
            <thead><tr><th>레벨</th><th>모듈</th><th>드릴 통과</th><th>진행</th></tr></thead>
            <tbody>
              {LEVELS.map((l) => {
                const mods = MODULES.filter((m) => m.levelId === l.id);
                const done = mods.filter((m) => state.completedModules.includes(m.id)).length;
                const drills = ALL_DRILLS.filter((d) => d.levelId === l.id);
                const passed = drills.filter((d) => (state.drills[d.id]?.mastery ?? 0) >= MASTERY_THRESHOLD).length;
                const pct = mods.length ? Math.round((done / mods.length) * 100) : 0;
                return (
                  <tr key={l.id}>
                    <td><Link to={`/curriculum/${l.id}`}>{l.id} {l.title}</Link></td>
                    <td className="mono">{done}/{mods.length}</td>
                    <td className="mono">{passed}/{drills.length}</td>
                    <td style={{ minWidth: 120 }}>
                      <div className="bar"><span style={{ width: `${pct}%` }} /></div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </section>

      {recent.length > 0 && (
        <section className="stack stack-12">
          <h2>최근 연습 기록</h2>
          <div className="table-scroll">
            <table className="data">
              <thead><tr><th>날짜</th><th>내용</th><th>시간</th></tr></thead>
              <tbody>
                {recent.map((e, i) => (
                  <tr key={i}><td className="mono tiny">{e.date}</td><td className="small">{e.what}</td><td className="mono tiny">{e.minutes}분</td></tr>
                ))}
              </tbody>
            </table>
          </div>
        </section>
      )}

      <section className="card stack stack-12">
        <h2 style={{ margin: 0, fontSize: '1.05rem' }}>데이터 관리</h2>
        <p className="small dim" style={{ margin: 0 }}>
          진도는 이 브라우저에만 저장됩니다(백엔드 없음). 기기를 옮기려면 아래에서 내보내세요.
        </p>
        <div className="btn-row">
          <button className="btn btn-sm" onClick={() => {
            navigator.clipboard?.writeText(exportState(state));
            setImportMsg('클립보드에 복사했습니다.');
          }}>진도 내보내기 (클립보드)</button>
          <button className="btn btn-sm" onClick={() => {
            if (confirm('모든 진도를 지웁니다. 되돌릴 수 없습니다. 계속할까요?')) reset();
          }}>전체 초기화</button>
        </div>
        <details>
          <summary className="tiny muted" style={{ cursor: 'pointer' }}>진도 가져오기</summary>
          <div className="stack stack-8" style={{ marginTop: 8 }}>
            <textarea rows={4} value={importText} onChange={(e) => setImportText(e.target.value)}
              placeholder="내보낸 JSON 을 붙여넣으세요" />
            <button className="btn btn-sm" onClick={() => {
              const s = importState(importText);
              if (s) { update(() => s); setImportMsg('가져왔습니다.'); }
              else setImportMsg('형식이 올바르지 않습니다.');
            }}>가져오기</button>
          </div>
        </details>
        {importMsg && <p className="tiny" role="status">{importMsg}</p>}
      </section>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <div className="card card-tight stack stack-4">
      <span className="eyebrow">{label}</span>
      <strong style={{ fontSize: '1.1rem' }}>{value}</strong>
    </div>
  );
}
