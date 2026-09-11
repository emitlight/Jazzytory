import { useMemo } from 'react';
import { parseChord, chordTones, guideTones, noteName, chordQualityKo, toMidi, parseNoteName } from '../lib/theory';
import { chordScale, scaleNotes } from '../lib/scales';
import { makeVoicing } from '../lib/voicing';
import type { VoicingStyleId } from '../data/types';
import Keyboard, { voicingToMarks, scaleToMarks } from './Keyboard';

interface Props {
  symbol: string;
  keyOf?: string;
  nextSymbol?: string;
  voicingStyle?: VoicingStyleId;
  /** 스케일 모드로 볼지 보이싱 모드로 볼지 */
  view?: 'voicing' | 'scale';
}

export default function ChordInspector({ symbol, keyOf, nextSymbol, voicingStyle = 'rootless-a', view = 'voicing' }: Props) {
  const data = useMemo(() => {
    const chord = parseChord(symbol);
    if (!chord) return null;
    const keyRoot = keyOf ? parseNoteName(keyOf.replace(/[-m]$/i, '')) ?? undefined : undefined;
    const keyMode = keyOf && /[-m]$/i.test(keyOf) ? 'minor' as const : 'major' as const;
    const next = nextSymbol ? parseChord(nextSymbol) ?? undefined : undefined;
    const cs = chordScale(chord, { keyRoot, keyMode, next });
    const voicing = makeVoicing(chord, voicingStyle);
    return { chord, cs, voicing };
  }, [symbol, keyOf, nextSymbol, voicingStyle]);

  if (!data) {
    return <div className="note note-warn">코드 심볼 <code>{symbol}</code> 을 해석하지 못했습니다.</div>;
  }
  const { chord, cs, voicing } = data;
  const tones = chordTones(chord);
  const gt = guideTones(chord);

  const marks = view === 'voicing'
    ? voicingToMarks(voicing.notes)
    : scaleToMarks(scaleNotes(chord.root, cs.scale), tones.map(toMidi), cs.avoid.map(toMidi));

  return (
    <div className="stack stack-12">
      <Keyboard
        range={[45, 84]}
        marks={marks}
        ariaLabel={`${symbol} ${view === 'voicing' ? voicing.labelKo : cs.scale.nameKo} 건반 표시`}
      />

      <div className="grid grid-2">
        <div className="sunken stack stack-8">
          <div className="eyebrow">구성음</div>
          <div className="row" style={{ gap: 6 }}>
            {tones.map((n, i) => (
              <span key={i} className="badge mono">{noteName(n, true)}</span>
            ))}
          </div>
          <div className="tiny muted">{chordQualityKo(chord)}</div>
          <div className="eyebrow" style={{ marginTop: 6 }}>가이드 톤 (3·7)</div>
          <div className="row" style={{ gap: 6 }}>
            {gt.map((n, i) => <span key={i} className="badge badge-accent mono">{noteName(n, true)}</span>)}
          </div>
        </div>

        <div className="sunken stack stack-8">
          <div className="eyebrow">코드 스케일</div>
          <div><strong>{cs.scale.nameKo}</strong> <span className="tiny muted">{cs.scale.name}</span></div>
          <div className="row" style={{ gap: 5 }}>
            {scaleNotes(chord.root, cs.scale).map((n, i) => (
              <span key={i} className="badge tiny mono">{noteName(n, true)}</span>
            ))}
          </div>
          <p className="tiny dim" style={{ margin: '4px 0 0' }}>{cs.rationale}</p>
          {cs.avoid.length > 0 && (
            <div className="tiny" style={{ color: 'var(--role-avoid)' }}>
              어보이드: {cs.avoid.map((n) => noteName(n, true)).join(', ')} — 지속음으로 쓰지 말 것
            </div>
          )}
          {cs.availableTensions.length > 0 && (
            <div className="tiny dim">
              사용 가능 텐션: {cs.availableTensions.map((t) => t.label).join(', ')}
            </div>
          )}
        </div>
      </div>

      {view === 'voicing' && (
        <div className="sunken stack stack-4">
          <div className="row-between">
            <strong className="small">{voicing.labelKo}</strong>
            <span className="tiny muted mono">
              {voicing.notes.map((n) => `${n.role}:${noteName(n.note, true)}${n.note.octave}`).join('  ')}
            </span>
          </div>
          <p className="tiny dim" style={{ margin: 0 }}>{voicing.description}</p>
          {voicing.warning && <div className="tiny" style={{ color: 'var(--warn)' }}>⚠ {voicing.warning}</div>}
        </div>
      )}
    </div>
  );
}
