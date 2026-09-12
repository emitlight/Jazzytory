import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useParams, useSearchParams, useNavigate } from 'react-router-dom';
import { parseChord, transposeChord, chordSymbol, noteName, toFrequency } from '../lib/theory';
import { voiceProgression, VOICING_META } from '../lib/voicing';
import { analyzeProgression, summarizeCadences, guessKey } from '../lib/analysis';
import { chordScale } from '../lib/scales';
import { progressionToBars } from '../lib/playalong';
import { ensureAudio, strikeChord, Transport as AudioTransport, swingRatio } from '../lib/audio';
import type { VoicingStyleId } from '../data/types';
import type { ScheduledEvent, Instrument } from '../lib/audio';
import Keyboard, { voicingToMarks } from '../components/Keyboard';
import ChordInspector from '../components/ChordInspector';
import Transport from '../components/Transport';
import EarTrainer from '../components/EarTrainer';
import PracticeDesigner from '../components/PracticeDesigner';
import { useApp } from '../state';

const TABS = [
  { id: 'voicing',     label: '보이싱 랩' },
  { id: 'progression', label: '진행 · 반주' },
  { id: 'keyboard',    label: '코드 탐색' },
  { id: 'ear',         label: '청음 훈련' },
  { id: 'design',      label: '연습 설계' },
  { id: 'metronome',   label: '메트로놈' },
] as const;

const KEYS = ['C', 'F', 'Bb', 'Eb', 'Ab', 'Db', 'Gb', 'B', 'E', 'A', 'D', 'G'];
const KEY_SEMITONE: Record<string, number> = { C: 0, Db: 1, D: 2, Eb: 3, E: 4, F: 5, Gb: 6, G: 7, Ab: 8, A: 9, Bb: 10, B: 11 };

export default function Lab() {
  const { tab } = useParams();
  const navigate = useNavigate();
  const active = TABS.find((t) => t.id === tab)?.id ?? 'voicing';

  return (
    <div className="stack stack-24">
      <header className="stack stack-8">
        <span className="eyebrow">Practice Lab</span>
        <h1 style={{ margin: 0 }}>연습 랩</h1>
        <p className="lead" style={{ maxWidth: '56ch' }}>
          읽는 곳이 아니라 <strong>손을 쓰는 곳</strong>입니다. 소리는 사용자가 버튼을 누른 뒤에만 납니다.
        </p>
      </header>

      <nav className="chips" aria-label="랩 탭">
        {TABS.map((t) => (
          <button
            key={t.id}
            className="chip"
            aria-pressed={active === t.id}
            onClick={() => navigate(`/lab/${t.id}`)}
          >{t.label}</button>
        ))}
      </nav>

      {active === 'voicing' && <VoicingLab />}
      {active === 'progression' && <ProgressionLab />}
      {active === 'keyboard' && <ChordExplorer />}
      {active === 'ear' && <EarTrainer />}
      {active === 'design' && <PracticeDesigner />}
      {active === 'metronome' && <Metronome />}
    </div>
  );
}

/* ══════════════════════ 보이싱 랩 ══════════════════════ */

function VoicingLab() {
  const [params] = useSearchParams();
  const [progInput, setProgInput] = useState(params.get('prog') ?? 'D-7 G7 C∆7');
  const [style, setStyle] = useState<VoicingStyleId>((params.get('style') as VoicingStyleId) ?? 'rootless-a');
  const [keyIdx, setKeyIdx] = useState(0);
  const [alternate, setAlternate] = useState(true);
  const [cycleMode, setCycleMode] = useState(false);

  const symbols = useMemo(
    () => progInput.split(/[\s|,]+/).map((s) => s.trim()).filter(Boolean),
    [progInput],
  );

  const transposed = useMemo(() => {
    const semis = KEY_SEMITONE[KEYS[keyIdx]] ?? 0;
    return symbols.map((s) => {
      const c = parseChord(s);
      return c ? chordSymbol(transposeChord(c, semis)) : s;
    });
  }, [symbols, keyIdx]);

  const voicings = useMemo(
    () => voiceProgression(transposed, style, { alternateAB: alternate }),
    [transposed, style, alternate],
  );

  const playAll = useCallback(() => {
    ensureAudio();
    voicings.forEach((v, i) => {
      setTimeout(() => strikeChord(v.notes.map((n) => toFrequency(n.note)), 1.5), i * 900);
    });
  }, [voicings]);

  const nextKey = useCallback(() => setKeyIdx((k) => (k + 1) % KEYS.length), []);
  const randomKey = useCallback(() => setKeyIdx(Math.floor(Math.random() * KEYS.length)), []);

  // 12키 순환 모드 — 정해진 간격으로 키를 바꿔 준다
  useEffect(() => {
    if (!cycleMode) return;
    const id = window.setInterval(nextKey, 8000);
    return () => window.clearInterval(id);
  }, [cycleMode, nextKey]);

  return (
    <div className="stack stack-16">
      <div className="panel stack stack-12">
        <div className="field">
          <label htmlFor="prog">코드 진행 (공백이나 | 로 구분)</label>
          <input id="prog" type="text" className="mono" value={progInput}
            onChange={(e) => setProgInput(e.target.value)} placeholder="D-7 G7 C∆7" />
        </div>

        <div className="stack stack-8">
          <span className="eyebrow">보이싱</span>
          <div className="chips">
            {(Object.keys(VOICING_META) as VoicingStyleId[]).map((s) => (
              <button key={s} className="chip" aria-pressed={style === s} onClick={() => setStyle(s)}>
                {VOICING_META[s].labelKo} <span className="muted tiny">{VOICING_META[s].level}</span>
              </button>
            ))}
          </div>
          <p className="tiny dim" style={{ margin: 0 }}>{VOICING_META[style].description}</p>
        </div>

        <div className="stack stack-8">
          <span className="eyebrow">조 (12키 순환)</span>
          <div className="chips">
            {KEYS.map((k, i) => (
              <button key={k} className="chip mono" aria-pressed={keyIdx === i} onClick={() => setKeyIdx(i)}>{k}</button>
            ))}
          </div>
        </div>

        <div className="row" style={{ gap: 14 }}>
          <label className="switch">
            <input type="checkbox" checked={alternate} onChange={(e) => setAlternate(e.target.checked)} />
            A/B 교대 (성부 이동 최소화)
          </label>
          <label className="switch">
            <input type="checkbox" checked={cycleMode} onChange={(e) => setCycleMode(e.target.checked)} />
            8초마다 키 자동 전환
          </label>
        </div>

        <div className="btn-row">
          <button className="btn btn-primary" onClick={playAll}>▶ 진행 들어보기</button>
          <button className="btn" onClick={nextKey}>다음 조 (4도권) →</button>
          <button className="btn" onClick={randomKey}>랜덤 조</button>
        </div>
      </div>

      <div className="stack stack-16">
        {voicings.map((v, i) => (
          <div key={i} className="card stack stack-8">
            <div className="row-between">
              <div className="row">
                <span className="badge badge-accent mono">{v.chordSymbol}</span>
                <span className="tiny muted">{v.labelKo}</span>
              </div>
              <button className="btn btn-sm"
                onClick={() => { ensureAudio(); strikeChord(v.notes.map((n) => toFrequency(n.note)), 1.8); }}>
                ♪ 소리
              </button>
            </div>
            <Keyboard range={[40, 84]} marks={voicingToMarks(v.notes)} ariaLabel={`${v.chordSymbol} ${v.labelKo}`} />
            <div className="row tiny muted mono" style={{ gap: 10 }}>
              {v.notes.map((n, j) => (
                <span key={j}>
                  <span style={{ fontWeight: 700 }}>{n.role}</span> {noteName(n.note, true)}{n.note.octave}
                  <span className="muted"> ({n.hand === 'L' ? '왼손' : '오른손'})</span>
                </span>
              ))}
            </div>
            {v.warning && <div className="tiny" style={{ color: 'var(--warn)' }}>⚠ {v.warning}</div>}
          </div>
        ))}
      </div>
    </div>
  );
}

/* ══════════════════════ 진행 · 반주 랩 ══════════════════════ */

function ProgressionLab() {
  const [params] = useSearchParams();
  const { state, update } = useApp();
  const [progInput, setProgInput] = useState(params.get('prog')?.replace(/\|/g, ' ') ?? 'D-7 G7 C∆7 C∆7');
  const [keyOf, setKeyOf] = useState(params.get('key') ?? '');
  const [playingBar, setPlayingBar] = useState<number | null>(null);
  const [selected, setSelected] = useState<number>(0);

  const symbols = useMemo(
    () => progInput.split(/[\s|,]+/).map((s) => s.trim()).filter(Boolean),
    [progInput],
  );
  const detectedKey = useMemo(() => keyOf || guessKey(symbols), [keyOf, symbols]);
  const analysis = useMemo(() => analyzeProgression(symbols, detectedKey), [symbols, detectedKey]);
  const cadences = useMemo(() => summarizeCadences(analysis), [analysis]);
  const bars = useMemo(() => progressionToBars(symbols, 1), [symbols]);

  return (
    <div className="stack stack-16">
      <div className="panel stack stack-12">
        <div className="row" style={{ gap: 12, alignItems: 'flex-end' }}>
          <div className="field" style={{ flex: 1, minWidth: 220 }}>
            <label htmlFor="prog2">코드 진행 — 마디당 코드 하나</label>
            <input id="prog2" type="text" className="mono" value={progInput}
              onChange={(e) => setProgInput(e.target.value)} />
          </div>
          <div className="field" style={{ width: 120 }}>
            <label htmlFor="key2">조 (자동 추정)</label>
            <input id="key2" type="text" className="mono" value={keyOf} placeholder={detectedKey}
              onChange={(e) => setKeyOf(e.target.value)} />
          </div>
        </div>
        <div className="chips">
          {[
            ['ii-V-I 메이저', 'D-7 G7 C∆7 C∆7'],
            ['ii-V-i 마이너', 'Dø7 G7alt C-7 C-7'],
            ['턴어라운드', 'C∆7 A7 D-7 G7'],
            ['트라이톤 서브', 'D-7 Db7 C∆7 C∆7'],
            ['블루스 첫 4마디', 'F7 Bb7 F7 F7'],
            ['리듬 체인지 A', 'Bb∆7 G7 C-7 F7'],
            ['백도어', 'C∆7 F-7 Bb7 C∆7'],
            ['콜트레인', 'B∆7 D7 G∆7 Bb7'],
          ].map(([label, prog]) => (
            <button key={label} className="chip" onClick={() => setProgInput(prog)}>{label}</button>
          ))}
        </div>
      </div>

      <Transport
        bars={bars}
        bpm={state.settings.bpm}
        onBpmChange={(b) => update((s) => ({ ...s, settings: { ...s.settings, bpm: b } }))}
        onBarChange={setPlayingBar}
      />

      <section className="stack stack-12">
        <div className="row-between">
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>기능 분석</h2>
          <span className="tiny muted">조: <span className="mono">{detectedKey}</span></span>
        </div>
        <div className="ls-bars">
          {analysis.map((a, i) => (
            <button key={i} type="button"
              className={`ls-bar${selected === i ? ' active' : ''}${playingBar === i ? ' playing' : ''}`}
              onClick={() => setSelected(i)}>
              <span className="ls-bar-num">{i + 1}</span>
              <span className="ls-chord">{symbols[i]}</span>
              <span className="roman">{a.roman}</span>
              {a.cadenceGroup !== undefined && <span className="ls-cadence" style={{ width: '100%' }} />}
            </button>
          ))}
        </div>
        {analysis[selected] && (
          <div className="sunken stack stack-4">
            <div className="row">
              <span className="badge badge-accent mono">{symbols[selected]}</span>
              <span className="badge tiny">{analysis[selected].roman}</span>
              <span className="tiny muted">{analysis[selected].role}</span>
            </div>
            <p className="small dim" style={{ margin: 0 }}>{analysis[selected].explain}</p>
          </div>
        )}
        {cadences.length > 0 && (
          <div className="note small">
            <strong>케이던스 {cadences.length}개 감지.</strong>{' '}
            {cadences.map((c) => `${c.chords.join('–')} → ${c.target} (${c.kind})`).join(' · ')}
            <br />
            이 덩어리를 <strong>한 문장</strong>으로 읽기 시작하면 암보 속도가 달라집니다.
          </div>
        )}
      </section>

      {symbols[selected] && (
        <section className="stack stack-12">
          <h2 style={{ margin: 0, fontSize: '1.05rem' }}>
            <span className="mono">{symbols[selected]}</span> 상세
          </h2>
          <ChordInspector
            symbol={symbols[selected]}
            keyOf={detectedKey}
            nextSymbol={symbols[selected + 1]}
            voicingStyle="rootless-a"
          />
        </section>
      )}
    </div>
  );
}

/* ══════════════════════ 코드 탐색 ══════════════════════ */

function ChordExplorer() {
  const [symbol, setSymbol] = useState('C7alt');
  const [view, setView] = useState<'voicing' | 'scale'>('voicing');
  const [style, setStyle] = useState<VoicingStyleId>('rootless-a');
  const parsed = parseChord(symbol);
  const cs = parsed ? chordScale(parsed) : null;

  return (
    <div className="stack stack-16">
      <div className="panel stack stack-12">
        <div className="field">
          <label htmlFor="sym">코드 심볼</label>
          <input id="sym" type="text" className="mono" value={symbol}
            onChange={(e) => setSymbol(e.target.value)} placeholder="C∆7, D-7, G7alt, Bø7 …" />
        </div>
        <div className="chips">
          {['C∆7', 'C6/9', 'D-7', 'D-∆7', 'G7', 'G7alt', 'G7#11', 'G13', 'Bø7', 'C°7', 'F7sus4', 'Ab∆7#11', 'C/E']
            .map((s) => (
              <button key={s} className="chip mono" aria-pressed={symbol === s} onClick={() => setSymbol(s)}>{s}</button>
            ))}
        </div>
        <div className="row" style={{ gap: 14 }}>
          <div className="chips">
            <button className="chip" aria-pressed={view === 'voicing'} onClick={() => setView('voicing')}>보이싱</button>
            <button className="chip" aria-pressed={view === 'scale'} onClick={() => setView('scale')}>코드 스케일</button>
          </div>
          {view === 'voicing' && (
            <select value={style} onChange={(e) => setStyle(e.target.value as VoicingStyleId)} style={{ width: 'auto' }}>
              {(Object.keys(VOICING_META) as VoicingStyleId[]).map((s) => (
                <option key={s} value={s}>{VOICING_META[s].labelKo}</option>
              ))}
            </select>
          )}
        </div>
      </div>

      {parsed && cs ? (
        <ChordInspector symbol={symbol} voicingStyle={style} view={view} />
      ) : (
        <div className="note note-warn">
          <code>{symbol}</code> 을 해석하지 못했습니다. 표기 예: <code>C-7</code>, <code>C∆7</code>,
          <code>Cø7</code>, <code>C°7</code>, <code>C7alt</code>, <code>C7#11</code>, <code>C6/9</code>, <code>C/E</code>
        </div>
      )}

      <p className="tiny muted">
        건반의 각 키를 클릭하면 소리가 납니다. 색은 화음 안에서의 역할을 나타내고,
        건반 위 라벨(R, 3, b7, #11 …)이 같은 정보를 문자로도 보여줍니다.
      </p>
    </div>
  );
}

/* ══════════════════════ 메트로놈 ══════════════════════ */

function Metronome() {
  const { state, update } = useApp();
  const [running, setRunning] = useState(false);
  const [mode, setMode] = useState<'24' | 'all' | '1'>('24');
  const [swing, setSwing] = useState(1);
  const ref = useRef<AudioTransport | null>(null);
  const bpm = state.settings.bpm;

  useEffect(() => () => { ref.current?.stop(); }, []);

  const toggle = () => {
    if (running) { ref.current?.stop(); ref.current = null; setRunning(false); return; }
    ensureAudio();
    const sr = swingRatio(bpm, swing);
    const t = new AudioTransport({
      bpm, beatsPerBar: 4,
      getBar: () => {
        const ev: ScheduledEvent[] = [];
        for (let b = 0; b < 4; b++) {
          const on = mode === 'all' ? true : mode === '1' ? b === 0 : b % 2 === 1;
          const inst: Instrument = b === 0 && mode !== '24' ? 'clickAccent' : 'click';
          if (on) ev.push({ beat: b, inst, freq: 0, duration: 0.1, velocity: 1 });
        }
        if (mode === 'all' && swing > 0) {
          for (let b = 0; b < 4; b++) ev.push({ beat: b + sr, inst: 'click', freq: 0, duration: 0.08, velocity: 0.45 });
        }
        return ev;
      },
    });
    ref.current = t; t.start(0); setRunning(true);
  };

  return (
    <div className="stack stack-16">
      <div className="panel stack stack-12">
        <div className="row">
          <button className="btn btn-primary btn-lg" onClick={toggle} aria-pressed={running}>
            {running ? '■ 정지' : '▶ 시작'}
          </button>
          <div className="field" style={{ flex: 1, minWidth: 180 }}>
            <label htmlFor="mbpm">템포 <span className="mono">{bpm} BPM</span></label>
            <input id="mbpm" type="range" min={40} max={280} value={bpm}
              onChange={(e) => update((s) => ({ ...s, settings: { ...s.settings, bpm: Number(e.target.value) } }))} />
          </div>
        </div>
        <div className="chips">
          <button className="chip" aria-pressed={mode === '24'} onClick={() => setMode('24')}>2·4박만 (권장)</button>
          <button className="chip" aria-pressed={mode === 'all'} onClick={() => setMode('all')}>4박 전부</button>
          <button className="chip" aria-pressed={mode === '1'} onClick={() => setMode('1')}>1박만 (고급)</button>
        </div>
        {mode === 'all' && (
          <div className="field">
            <label htmlFor="mswing">스윙 8분음표 <span className="mono">{Math.round(swing * 100)}%</span></label>
            <input id="mswing" type="range" min={0} max={1} step={0.05} value={swing}
              onChange={(e) => setSwing(Number(e.target.value))} />
          </div>
        )}
      </div>
      <div className="note small">
        <strong>왜 2·4박인가.</strong> 재즈의 시간 감각은 1·3박이 아니라 2·4박(백비트)에 기댑니다.
        클릭을 2·4박에만 두면 1·3박을 스스로 만들어야 하고, 그때 비로소 타임이 몸에 생깁니다.
        익숙해지면 1박만 남기고, 마지막에는 <strong>2마디에 한 번</strong>만 울리게 하세요.
      </div>
    </div>
  );
}
