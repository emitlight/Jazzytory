import { useState, useMemo, useCallback } from 'react';
import { EAR_DRILLS } from '../data';
import { parseChord, chordNotes, toFrequency, transposeChord, parseIntervalName, intervalNameKo } from '../lib/theory';
import { ensureAudio, strikeChord, strike, playNote } from '../lib/audio';
import { makeVoicing } from '../lib/voicing';
import { useApp } from '../state';


export default function EarTrainer() {
  const { logSession } = useApp();
  const [drillId, setDrillId] = useState(EAR_DRILLS[0]?.id ?? '');
  const drill = EAR_DRILLS.find((d) => d.id === drillId) ?? EAR_DRILLS[0];
  const [answer, setAnswer] = useState<string | null>(null);
  const [result, setResult] = useState<'right' | 'wrong' | null>(null);
  const [score, setScore] = useState({ right: 0, total: 0 });
  const [current, setCurrent] = useState<{ item: string; transpose: number } | null>(null);

  const options = useMemo(() => drill?.bank ?? [], [drill]);

  const play = useCallback((item: string, transpose: number) => {
    ensureAudio();
    if (drill.kind === 'interval') {
      const semis = parseIntervalName(item) ?? 4;
      const rootMidi = 55 + transpose;
      const f = (m: number) => 440 * Math.pow(2, (m - 69) / 12);
      strike(f(rootMidi), 1.2);
      setTimeout(() => strike(f(rootMidi + semis), 1.4), 620);
      return;
    }
    if (drill.kind === 'chord-quality') {
      const c = parseChord(item);
      if (!c) return;
      const t = transposeChord(c, transpose);
      strikeChord(chordNotes(t, { includeTensions: false }).map((n) => toFrequency({ ...n, octave: 3 })), 2.2, 45);
      return;
    }
    // 진행류 — 각 코드를 루트리스로 순차 재생 + 베이스
    const chords = item.split('|').map((s) => s.trim());
    chords.forEach((sym, i) => {
      const c = parseChord(sym);
      if (!c) return;
      const t = transposeChord(c, transpose);
      const v = makeVoicing(t, i % 2 === 0 ? 'rootless-a' : 'rootless-b', { targetBottom: 52 });
      setTimeout(() => {
        strikeChord(v.notes.map((n) => toFrequency(n.note)), 1.6, 10);
        playNote('bass', toFrequency({ ...t.root, octave: 2 }), ensureAudio().currentTime + 0.01, 0.9, 1);
      }, i * 900);
    });
  }, [drill]);

  const nextQuestion = useCallback(() => {
    if (!options.length) return;
    const item = options[Math.floor(Math.random() * options.length)];
    const transpose = Math.floor(Math.random() * 12) - 6;
    setCurrent({ item, transpose });
    setAnswer(null);
    setResult(null);
    setTimeout(() => play(item, transpose), 120);
  }, [options, play]);

  const submit = (choice: string) => {
    if (!current || result) return;
    setAnswer(choice);
    const ok = choice === current.item;
    setResult(ok ? 'right' : 'wrong');
    setScore((s) => ({ right: s.right + (ok ? 1 : 0), total: s.total + 1 }));
  };

  const label = (item: string) =>
    drill.kind === 'interval' ? `${intervalNameKo(item)} (${item})` : item;

  return (
    <div className="stack stack-16">
      <div className="panel stack stack-12">
        <div className="field">
          <label htmlFor="eardrill">훈련 종류</label>
          <select id="eardrill" value={drillId} onChange={(e) => { setDrillId(e.target.value); setCurrent(null); setResult(null); }}>
            {EAR_DRILLS.map((d) => (
              <option key={d.id} value={d.id}>{d.levelId} · {d.title}</option>
            ))}
          </select>
        </div>
        <p className="small dim" style={{ margin: 0 }}>{drill?.description}</p>
        <div className="btn-row">
          <button className="btn btn-primary" onClick={nextQuestion}>
            {current ? '다음 문제' : '시작하기'}
          </button>
          {current && (
            <button className="btn" onClick={() => play(current.item, current.transpose)}>♪ 다시 듣기</button>
          )}
          {score.total > 0 && (
            <span className="badge badge-accent" style={{ alignSelf: 'center' }}>
              {score.right}/{score.total} ({Math.round((score.right / score.total) * 100)}%)
            </span>
          )}
        </div>
      </div>

      {current && (
        <div className="card stack stack-12">
          <div className="eyebrow">무엇이 들렸나요?</div>
          <div className="chips">
            {options.map((o) => {
              const isAnswer = o === current.item;
              const chosen = answer === o;
              let cls = 'chip mono';
              if (result && isAnswer) cls += ' ';
              return (
                <button
                  key={o}
                  className={cls}
                  aria-pressed={chosen}
                  disabled={!!result}
                  onClick={() => submit(o)}
                  style={result && isAnswer
                    ? { borderColor: 'var(--ok)', color: 'var(--ok)', background: 'var(--ok-soft)' }
                    : result && chosen ? { borderColor: 'var(--danger)', color: 'var(--danger)', background: 'var(--danger-soft)' }
                    : undefined}
                >{label(o)}</button>
              );
            })}
          </div>

          {result && (
            <div className={result === 'right' ? 'note' : 'note note-warn'}>
              {result === 'right'
                ? <><strong>맞습니다.</strong> 같은 소리를 다른 조에서도 알아들을 수 있는지 계속 확인하세요 — 문제는 매번 랜덤한 조로 나옵니다.</>
                : <><strong>정답은 {label(current.item)} 였습니다.</strong> 틀린 것을 부끄러워할 필요 없습니다. 다시 듣고, 자기 목소리로 따라 불러 보세요. 귀는 입을 통해 자랍니다.</>}
            </div>
          )}
        </div>
      )}

      <div className="note small">
        <strong>청음 훈련의 원칙.</strong> 매 문제는 <strong>랜덤한 조</strong>로 출제됩니다.
        절대음감을 기르려는 게 아니라 <strong>관계</strong>를 듣는 훈련이기 때문입니다.
        하루 10분씩 매일이 주 1회 한 시간보다 낫습니다.
      </div>

      {score.total >= 10 && (
        <button className="btn btn-sm" onClick={() => { logSession(10, `청음 훈련 — ${drill.title}`); setScore({ right: 0, total: 0 }); }}>
          이 세션을 연습 기록에 저장 (10분)
        </button>
      )}
    </div>
  );
}
