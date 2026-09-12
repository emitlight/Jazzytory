import { useMemo } from 'react';
import type { TuneSection } from '../data/types';
import { analyzeProgression } from '../lib/analysis';
import { flattenChart } from '../lib/playalong';

interface Props {
  sections: TuneSection[];
  keyOf: string;
  /** 이조 반음 */
  transpose?: number;
  showRomanNumerals?: boolean;
  activeBar?: number | null;
  playingBar?: number | null;
  onSelectBar?: (absoluteBar: number, chords: string[]) => void;
  beatsPerBar?: number;
}

import { parseChord, transposeChord, chordSymbol } from '../lib/theory';

function tr(symbol: string, semis: number): string {
  if (!semis) return symbol;
  const c = parseChord(symbol);
  if (!c) return symbol;
  return chordSymbol(transposeChord(c, semis));
}

export default function LeadSheet({
  sections, keyOf, transpose = 0, showRomanNumerals = true,
  activeBar = null, playingBar = null, onSelectBar, beatsPerBar = 4,
}: Props) {
  const flat = useMemo(() => flattenChart(sections, beatsPerBar), [sections, beatsPerBar]);

  const analysis = useMemo(() => {
    const symbols = flat.flatMap((b) => b.chords.map((c) => tr(c, transpose)));
    return analyzeProgression(symbols, tr(keyOf.replace(/-$/, ''), transpose) + (keyOf.endsWith('-') ? '-' : ''));
  }, [flat, keyOf, transpose]);

  // 마디별 분석 인덱스 매핑
  const barAnalysis = useMemo(() => {
    const out: { roman: string; group?: number }[][] = [];
    let i = 0;
    for (const bar of flat) {
      const items = bar.chords.map(() => {
        const a = analysis[i++];
        return { roman: a?.roman ?? '', group: a?.cadenceGroup };
      });
      out.push(items);
    }
    return out;
  }, [flat, analysis]);

  // 섹션별로 다시 묶어 렌더링
  let cursor = 0;
  return (
    <div className="leadsheet">
      {sections.map((sec, si) => {
        const start = cursor;
        cursor += sec.bars.length;
        return (
          <div className="ls-section" key={`${sec.label}-${si}`}>
            <div className="ls-section-label">{sec.label}</div>
            <div className="ls-bars">
              {sec.bars.map((_, bi) => {
                const abs = start + bi;
                const bar = flat[abs];
                if (!bar) return null;
                const isEmpty = sections[si].bars[bi].chords.length === 0;
                const cls = ['ls-bar'];
                if (activeBar === abs) cls.push('active');
                if (playingBar === abs) cls.push('playing');
                const hasCadence = barAnalysis[abs]?.some((a) => a.group !== undefined);
                return (
                  <button
                    type="button"
                    key={abs}
                    className={cls.join(' ')}
                    onClick={() => onSelectBar?.(abs, bar.chords)}
                    aria-label={`${abs + 1}마디 ${bar.chords.map((c) => tr(c, transpose)).join(', ')}`}
                  >
                    <span className="ls-bar-num">{abs + 1}</span>
                    {isEmpty ? (
                      <span className="ls-chord muted" aria-hidden="true">%</span>
                    ) : (
                      bar.chords.map((c, ci) => (
                        <span key={ci} className="stack stack-4">
                          <span className="ls-chord">{tr(c, transpose)}</span>
                          {showRomanNumerals && (
                            <span className="roman">{barAnalysis[abs]?.[ci]?.roman}</span>
                          )}
                        </span>
                      ))
                    )}
                    {hasCadence && <span className="ls-cadence" style={{ width: '100%' }} />}
                  </button>
                );
              })}
            </div>
          </div>
        );
      })}
    </div>
  );
}
