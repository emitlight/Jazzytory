import { useMemo, useCallback } from 'react';
import { type Note, toMidi, midiToNote, noteName, noteNameKo, toFrequency } from '../lib/theory';
import { strike, ensureAudio } from '../lib/audio';

export type KeyRole = 'R' | '3' | '5' | '7' | 'T' | 'A';

export interface KeyMark {
  midi: number;
  role?: KeyRole;
  /** 건반 위에 표시할 라벨 (예: "b7", "#11") */
  label?: string;
}

interface Props {
  /** 표시 음역 [최저 MIDI, 최고 MIDI] */
  range?: [number, number];
  marks?: KeyMark[];
  /** 건반 클릭 시 */
  onKeyDown?: (note: Note) => void;
  /** 클릭 시 소리 재생 */
  playable?: boolean;
  height?: number;
  ariaLabel?: string;
}

const WHITE_PC = [0, 2, 4, 5, 7, 9, 11];
const isWhite = (midi: number) => WHITE_PC.includes(((midi % 12) + 12) % 12);

/**
 * 검은 건반의 미세 보정 (흰건반 폭 대비).
 * 실제 피아노에서 검은 건반은 두 흰 건반의 정확한 경계에 있지 않다 —
 * C♯ 는 C 쪽으로, D♯ 는 D 쪽으로 치우쳐 있다. 0 이면 경계 정중앙.
 */
const BLACK_NUDGE: Record<number, number> = {
  1: -0.09,   // C#
  3: 0.09,    // D#
  6: -0.11,   // F#
  8: 0,       // G#
  10: 0.11,   // A#
};

export default function Keyboard({
  range = [48, 84], marks = [], onKeyDown, playable = true, height = 132, ariaLabel = '피아노 건반',
}: Props) {
  const [lo, hi] = range;
  const markMap = useMemo(() => {
    const m = new Map<number, KeyMark>();
    for (const k of marks) m.set(k.midi, k);
    return m;
  }, [marks]);

  const whites = useMemo(() => {
    const out: number[] = [];
    for (let m = lo; m <= hi; m++) if (isWhite(m)) out.push(m);
    return out;
  }, [lo, hi]);

  const press = useCallback((midi: number) => {
    const n = midiToNote(midi);
    if (playable) { ensureAudio(); strike(toFrequency(n), 1.3); }
    onKeyDown?.(n);
  }, [onKeyDown, playable]);

  const onKeyPress = (e: React.KeyboardEvent, midi: number) => {
    if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); press(midi); }
  };

  const whiteW = 34;
  const blackW = 22;

  return (
    <div className="keyboard-scroll">
      <div
        className="keyboard"
        role="group"
        aria-label={ariaLabel}
        style={{ height, minWidth: whites.length * (whiteW - 1) + 1 }}
      >
        {whites.map((midi, i) => {
          const mark = markMap.get(midi);
          const n = midiToNote(midi);
          const showC = ((midi % 12) + 12) % 12 === 0;
          return (
            <button
              key={midi}
              type="button"
              className={`key-white${mark ? ` key-on key-role-${mark.role ?? 'R'}` : ''}`}
              style={{ height, width: whiteW, zIndex: 1 }}
              onPointerDown={() => press(midi)}
              onKeyDown={(e) => onKeyPress(e, midi)}
              aria-label={`${noteNameKo(n)}${mark ? `, ${mark.label ?? mark.role}` : ''}`}
              aria-pressed={!!mark}
              tabIndex={i === 0 || mark ? 0 : -1}
            >
              <span className="key-label">{mark?.label ?? (showC ? noteName(n) + n.octave : '')}</span>
            </button>
          );
        })}
        {/* 검은 건반은 흰 건반 위에 절대 배치 */}
        {(() => {
          const nodes: React.ReactNode[] = [];
          // 흰 건반은 1px 씩 겹쳐 그리므로 실제 이동 폭은 whiteW - 1 이다.
          const step = whiteW - 1;
          let whitesBefore = 0;
          for (let midi = lo; midi <= hi; midi++) {
            if (isWhite(midi)) { whitesBefore++; continue; }
            // 화면 왼쪽 끝이 검은 건반으로 시작하면 걸칠 흰 건반이 없다
            if (whitesBefore === 0) continue;
            const pc = ((midi % 12) + 12) % 12;
            // 바로 아래 흰 건반의 오른쪽 경계에 중심을 맞추고 건반별로 미세 보정
            const left = whitesBefore * step - blackW / 2 + (BLACK_NUDGE[pc] ?? 0) * whiteW;
            const mark = markMap.get(midi);
            const n = midiToNote(midi);
            nodes.push(
              <button
                key={`b${midi}`}
                type="button"
                className={`key-black${mark ? ` key-on key-role-${mark.role ?? 'R'}` : ''}`}
                style={{ left, width: blackW, height: height * 0.63 }}
                onPointerDown={() => press(midi)}
                onKeyDown={(e) => onKeyPress(e, midi)}
                aria-label={`${noteNameKo(n)}${mark ? `, ${mark.label ?? mark.role}` : ''}`}
                aria-pressed={!!mark}
                tabIndex={mark ? 0 : -1}
              >
                <span className="key-label">{mark?.label ?? ''}</span>
              </button>,
            );
          }
          return nodes;
        })()}
      </div>
    </div>
  );
}

/** 보이싱을 건반 마크로 변환 */
export function voicingToMarks(notes: { note: Note; role: string }[]): KeyMark[] {
  return notes.map((v) => {
    const r = v.role;
    let role: KeyRole = 'T';
    if (r === 'R') role = 'R';
    else if (r.endsWith('3')) role = '3';
    else if (r === '5' || r === 'b5' || r === '#5') role = '5';
    else if (r.includes('7') || r === '6') role = '7';
    return { midi: toMidi(v.note), role, label: r };
  });
}

/** 스케일을 건반 마크로 (어보이드 노트는 별도 색) */
export function scaleToMarks(scaleNotes: Note[], chordToneMidis: number[], avoidMidis: number[]): KeyMark[] {
  const chordPcs = new Set(chordToneMidis.map((m) => ((m % 12) + 12) % 12));
  const avoidPcs = new Set(avoidMidis.map((m) => ((m % 12) + 12) % 12));
  return scaleNotes.map((n) => {
    const pc = ((toMidi(n) % 12) + 12) % 12;
    return {
      midi: toMidi(n),
      role: avoidPcs.has(pc) ? 'A' : chordPcs.has(pc) ? 'R' : 'T',
      label: noteName(n, true),
    } as KeyMark;
  });
}
