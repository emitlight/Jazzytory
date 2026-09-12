import { useState, useMemo, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { parseChord, noteName, toFrequency, transposeChord, chordSymbol } from '../lib/theory';
import { chordScale } from '../lib/scales';
import { voiceProgression } from '../lib/voicing';
import { analyzeProgression } from '../lib/analysis';
import { ensureAudio, strikeChord } from '../lib/audio';
import Keyboard, { voicingToMarks } from './Keyboard';

const DEMOS = [
  { label: 'ii–V–I', key: 'C',  chords: ['D-7', 'G7', 'C∆7'],        blurb: '재즈에서 가장 자주 나오는 세 마디. 이것만 12키로 되면 스탠다드의 절반이 열립니다.' },
  { label: '마이너 ii–V–i', key: 'C-', chords: ['Dø7', 'G7alt', 'C-7'], blurb: '같은 자리인데 어두워집니다. ø7과 얼터드가 그 색을 만듭니다.' },
  { label: '트라이톤 서브', key: 'C', chords: ['D-7', 'Db7', 'C∆7'], blurb: 'G7 자리에 Db7. 베이스가 반음으로 미끄러져 내려옵니다.' },
  { label: '턴어라운드', key: 'C', chords: ['C∆7', 'A7', 'D-7', 'G7'], blurb: '곡의 끝에서 처음으로 돌아가는 길. A7이 문을 엽니다.' },
];

const KEYS = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'];
const KEY_SEMI: Record<string, number> = { C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };

/**
 * 홈 히어로의 인터랙티브 데모.
 * "손이 움직이기까지의 시간을 줄인다"는 약속은 설명이 아니라 즉시 증명되어야 한다.
 * 그래서 첫 화면에서 클릭 0회로 건반이 보이고, 1회로 소리가 난다.
 */
export default function HeroDemo() {
  const [demoIdx, setDemoIdx] = useState(0);
  const [keyIdx, setKeyIdx] = useState(0);
  const [step, setStep] = useState(0);
  const [played, setPlayed] = useState(false);

  const demo = DEMOS[demoIdx];
  const semis = KEY_SEMI[KEYS[keyIdx]] ?? 0;

  const chords = useMemo(
    () => demo.chords.map((c) => {
      const p = parseChord(c);
      return p ? chordSymbol(transposeChord(p, semis)) : c;
    }),
    [demo, semis],
  );

  const voicings = useMemo(
    () => voiceProgression(chords, 'rootless-a', { alternateAB: true }),
    [chords],
  );

  // 데모의 기준 조를 현재 이조량만큼 옮겨 로마숫자 분석에 넘긴다
  const analysis = useMemo(() => {
    const isMinor = demo.key.endsWith('-');
    const base = isMinor ? demo.key.slice(0, -1) : demo.key;
    const pc = ((KEY_SEMI[base] ?? 0) + semis) % 12;
    const root = KEYS.find((k) => KEY_SEMI[k] === pc) ?? base;
    return analyzeProgression(chords, root + (isMinor ? '-' : ''));
  }, [chords, demo.key, semis]);

  const current = voicings[Math.min(step, voicings.length - 1)];
  const currentChord = parseChord(chords[Math.min(step, chords.length - 1)]);
  const cs = currentChord ? chordScale(currentChord, { next: parseChord(chords[step + 1] ?? '') ?? undefined }) : null;

  const playOne = useCallback((i: number) => {
    ensureAudio();
    const v = voicings[i];
    if (!v) return;
    strikeChord(v.notes.map((n) => toFrequency(n.note)), 1.8, 8);
    setStep(i);
    setPlayed(true);
  }, [voicings]);

  const playAll = useCallback(() => {
    ensureAudio();
    setPlayed(true);
    voicings.forEach((v, i) => {
      window.setTimeout(() => {
        strikeChord(v.notes.map((n) => toFrequency(n.note)), 1.7, 8);
        setStep(i);
      }, i * 850);
    });
  }, [voicings]);

  return (
    <div className="card stack stack-16" aria-label="인터랙티브 데모">
      <div className="row-between">
        <div className="chips">
          {DEMOS.map((d, i) => (
            <button key={d.label} className="chip" aria-pressed={demoIdx === i}
              onClick={() => { setDemoIdx(i); setStep(0); }}>{d.label}</button>
          ))}
        </div>
        <div className="row">
          <span className="tiny muted">조</span>
          <button className="btn btn-sm" onClick={() => setKeyIdx((k) => (k + 1) % KEYS.length)}
            aria-label="다음 조로 이조">
            <span className="mono">{KEYS[keyIdx]}</span> →
          </button>
        </div>
      </div>

      <div className="row" style={{ gap: 8 }}>
        {chords.map((c, i) => (
          <button key={i} type="button"
            className={`btn ${step === i ? 'btn-primary' : ''}`}
            onClick={() => playOne(i)}
            style={{ flexDirection: 'column', gap: 2, minWidth: 86, alignItems: 'flex-start' }}
          >
            <span className="chordsym" style={{ fontSize: '1.05rem' }}>{c}</span>
            <span className="roman">{analysis[i]?.roman ?? ''}</span>
          </button>
        ))}
        <button className="btn btn-primary" onClick={playAll} style={{ marginLeft: 'auto' }}>
          ▶ 전부 듣기
        </button>
      </div>

      {current && (
        <Keyboard
          range={[45, 84]}
          marks={voicingToMarks(current.notes)}
          ariaLabel={`${current.chordSymbol} 루트리스 보이싱`}
        />
      )}

      <div className="row-between" style={{ alignItems: 'flex-start', gap: 16 }}>
        <div className="stack stack-4" style={{ flex: 1, minWidth: 220 }}>
          <span className="eyebrow">지금 누르고 있는 것</span>
          <span className="small mono">
            {current?.notes.map((n) => `${n.role} ${noteName(n.note, true)}${n.note.octave}`).join('  ')}
          </span>
          {cs && <span className="tiny muted">코드 스케일: {cs.scale.nameKo}</span>}
        </div>
        <div className="stack stack-4" style={{ flex: 1, minWidth: 220 }}>
          <p className="small dim" style={{ margin: 0 }}>{demo.blurb}</p>
        </div>
      </div>

      <div className="row-between">
        <p className="tiny muted" style={{ margin: 0 }}>
          {played
            ? '이게 루트리스 보이싱입니다. 왼손 네 음으로 코드 전체가 들립니다.'
            : '코드를 누르면 소리가 납니다. 조를 바꾸면 12키 전부로 이조됩니다.'}
        </p>
        <Link className="btn btn-sm" to="/lab/voicing">랩에서 계속 →</Link>
      </div>
    </div>
  );
}
