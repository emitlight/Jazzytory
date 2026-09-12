import { useEffect, useRef, useState, useCallback } from 'react';
import { Transport as AudioTransport, ensureAudio, setMasterVolume } from '../lib/audio';
import { buildPlayalong, type FlatBar, type PlayalongOptions } from '../lib/playalong';

interface Props {
  bars: FlatBar[];
  bpm: number;
  onBpmChange: (bpm: number) => void;
  onBarChange?: (bar: number | null) => void;
  transpose?: number;
  beatsPerBar?: number;
  compact?: boolean;
}

export default function Transport({
  bars, bpm, onBpmChange, onBarChange, transpose = 0, beatsPerBar = 4, compact = false,
}: Props) {
  const [playing, setPlaying] = useState(false);
  const [parts, setParts] = useState({ bass: true, piano: true, drums: true, click: false });
  const [swing, setSwing] = useState(1);
  const [volume, setVolume] = useState(0.85);
  const transportRef = useRef<AudioTransport | null>(null);

  const stop = useCallback(() => {
    transportRef.current?.stop();
    transportRef.current = null;
    setPlaying(false);
    onBarChange?.(null);
  }, [onBarChange]);

  // 언마운트 시 반드시 정지 — 페이지를 떠났는데 소리가 남으면 안 된다
  useEffect(() => () => { transportRef.current?.stop(); }, []);

  // 설정이 바뀌면 재생 중이던 것을 새 설정으로 다시 시작
  useEffect(() => {
    if (!playing) return;
    const t = transportRef.current;
    if (t) t.setBpm(bpm);
  }, [bpm, playing]);

  const start = () => {
    ensureAudio();
    setMasterVolume(volume);
    if (!bars.length) return;
    const opts: PlayalongOptions = {
      bpm, beatsPerBar, bass: parts.bass, piano: parts.piano, drums: parts.drums,
      click: parts.click, swing, transpose, compDensity: 0.6,
    };
    const engine = buildPlayalong(bars, opts);
    const t = new AudioTransport({
      bpm, beatsPerBar,
      getBar: engine.getBar,
      onBar: (i) => onBarChange?.(i % bars.length),
    });
    transportRef.current = t;
    t.start(0);
    setPlaying(true);
  };

  const toggle = () => (playing ? stop() : start());

  return (
    <div className="panel stack stack-12">
      <div className="row">
        <button className="btn btn-primary btn-lg" onClick={toggle} aria-pressed={playing}>
          {playing ? '■ 정지' : '▶ 반주 재생'}
        </button>
        <div className="field" style={{ minWidth: 180, flex: 1 }}>
          <label htmlFor="tempo">템포 <span className="mono">{bpm} BPM</span></label>
          <input
            id="tempo" type="range" min={40} max={280} step={1} value={bpm}
            onChange={(e) => onBpmChange(Number(e.target.value))}
          />
        </div>
      </div>

      {!compact && (
        <>
          <div className="row" style={{ gap: 14 }}>
            {([['bass', '베이스'], ['piano', '피아노'], ['drums', '드럼'], ['click', '클릭 2·4박']] as const).map(([k, label]) => (
              <label className="switch" key={k}>
                <input
                  type="checkbox"
                  checked={parts[k]}
                  onChange={(e) => setParts((p) => ({ ...p, [k]: e.target.checked }))}
                />
                {label}
              </label>
            ))}
          </div>
          <div className="row" style={{ gap: 16 }}>
            <div className="field" style={{ minWidth: 150, flex: 1 }}>
              <label htmlFor="swing">스윙 <span className="mono">{Math.round(swing * 100)}%</span></label>
              <input id="swing" type="range" min={0} max={1} step={0.05} value={swing}
                onChange={(e) => setSwing(Number(e.target.value))} />
            </div>
            <div className="field" style={{ minWidth: 150, flex: 1 }}>
              <label htmlFor="vol">음량</label>
              <input id="vol" type="range" min={0} max={1} step={0.05} value={volume}
                onChange={(e) => { setVolume(Number(e.target.value)); setMasterVolume(Number(e.target.value)); }} />
            </div>
          </div>
          <p className="tiny muted" style={{ margin: 0 }}>
            반주는 브라우저에서 실시간 합성됩니다. 워킹 베이스와 컴핑은 매번 조금씩 달라지며,
            컴핑은 의도적으로 빈 마디를 남깁니다 — 당신의 연주를 덮지 않기 위해서입니다.
          </p>
        </>
      )}
    </div>
  );
}
