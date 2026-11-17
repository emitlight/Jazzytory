import { useEffect, useRef, useState } from 'react';
import type { Album } from '../data/types';
import { useApp } from '../state';
import { RichText } from './Prose';
import ART from '../data/art.json';

const BASE = import.meta.env.BASE_URL;
const COVERS = new Set<string>(ART.covers);
const PIANIST = ART.pianist as Record<string, string>;

export const coverUrl = (id: string) => (COVERS.has(id) ? `${BASE}art/covers/${id}.svg` : null);
export const personUrl = (albumId: string) => (PIANIST[albumId] ? `${BASE}art/people/${PIANIST[albumId]}.svg` : null);

/** 커버 한 장 — 그림이 없으면 제목 판으로 대신한다 */
export function Cover({ album, size = 'md' }: { album: Album; size?: 'sm' | 'md' }) {
  const u = coverUrl(album.id);
  return (
    <span className={`cover cover-${size}`}>
      {u ? <img src={u} alt="" loading="lazy" decoding="async" /> : <span className="cover-fallback">{album.title}</span>}
    </span>
  );
}

/**
 * 명반 책장 — 커버를 한 줄로 늘어놓고, 누르면 그 자리에서 자세히(왜 필청인가 · 무엇을 들을까)를 연다.
 * 커버는 실제 음반 커버가 아니라 색 · 구도만 참고해 새로 그린 헌정 그림이다(art/STYLE.md).
 */
export default function AlbumShelf({ albums, moduleId, label }: { albums: Album[]; moduleId?: string; label: string }) {
  const [open, setOpen] = useState<Album | null>(null);
  if (albums.length === 0) return null;
  return (
    <div className="shelf" role="group" aria-label={label}>
      <ul className="shelf-row">
        {albums.map((a) => (
          <li key={a.id}>
            <button type="button" className="shelf-item" onClick={() => setOpen(a)} aria-label={`${a.title} — ${a.leader}, ${a.year}. 자세히`}>
              <Cover album={a} />
              <span className="shelf-title">{a.title}</span>
              <span className="shelf-sub">{a.pianist.split(' (')[0]} · {a.year}</span>
            </button>
          </li>
        ))}
      </ul>
      {open && <AlbumDialog album={open} moduleId={moduleId} onClose={() => setOpen(null)} />}
    </div>
  );
}

function AlbumDialog({ album, moduleId, onClose }: { album: Album; moduleId?: string; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const { state, toggleListened } = useApp();
  const listened = state.listened.includes(album.id);
  useEffect(() => {
    const d = ref.current;
    if (d && !d.open) d.showModal();
    const close = () => onClose();
    d?.addEventListener('close', close);
    return () => d?.removeEventListener('close', close);
  }, [onClose]);
  // 이 강의와 이어진 트랙을 먼저
  const notes = [...album.trackNotes].sort((a, b) => Number(b.moduleId === moduleId) - Number(a.moduleId === moduleId));
  const face = personUrl(album.id);
  return (
    <dialog ref={ref} className="album-dialog" aria-labelledby="album-dlg-title" onClick={(e) => { if (e.target === ref.current) ref.current?.close(); }}>
      <div className="album-dlg-grid">
        <div className="album-dlg-art">
          <Cover album={album} />
          {face && <img className="album-dlg-face" src={face} alt="" loading="lazy" />}
        </div>
        <div className="stack stack-12">
          <div className="stack stack-4">
            <span className="tiny muted">필청 명반 · {album.levelId}</span>
            <h2 id="album-dlg-title" style={{ margin: 0 }}>{album.title}</h2>
            <span className="small dim">{album.leader} · {album.year}{album.label ? ` · ${album.label}` : ''}</span>
            <span className="tiny muted">피아노 {album.pianist}</span>
          </div>
          <p className="small" style={{ margin: 0 }}><RichText text={album.why} /></p>
          <ol className="album-dlg-tracks">
            {notes.map((t) => (
              <li key={t.track + (t.at ?? '')}>
                <strong className="small">{t.track}</strong>{t.at && <span className="tiny muted"> · {t.at}</span>}
                <p className="small dim" style={{ margin: '2px 0 0' }}><RichText text={t.listenFor} /></p>
              </li>
            ))}
          </ol>
          <div className="row" style={{ gap: 8 }}>
            <button type="button" className={`btn btn-sm${listened ? '' : ' btn-primary'}`} aria-pressed={listened} onClick={() => toggleListened(album.id)}>
              {listened ? '✓ 들었어요' : '들었어요 표시'}
            </button>
            <button type="button" className="btn btn-sm btn-ghost" onClick={() => ref.current?.close()}>닫기</button>
          </div>
          <p className="tiny muted" style={{ margin: 0 }}>커버 그림은 원작의 색 · 구도를 참고해 새로 그린 헌정 일러스트입니다.</p>
        </div>
      </div>
    </dialog>
  );
}
