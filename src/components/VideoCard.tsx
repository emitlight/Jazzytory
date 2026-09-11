import { useState } from 'react';
import type { VideoResource } from '../data/types';

/**
 * 영상 카드 — 임베드 정책
 *  1) videoId 가 있고 verified 인 경우에만 iframe 을 띄운다.
 *  2) 그 전에 썸네일(i.ytimg.com)로 실제 생존 여부를 한 번 더 확인한다.
 *     썸네일이 깨지면 그 영상은 존재하지 않거나 비공개다 → 검색 폴백으로 전환.
 *  3) 그 외에는 채널 + 정밀 검색어 딥링크 카드로 렌더링한다.
 *
 * 깨진 임베드는 없는 것보다 나쁘다. 그래서 추측한 ID 를 절대 싣지 않는다.
 */
export default function VideoCard({ video }: { video: VideoResource }) {
  const [thumbOk, setThumbOk] = useState<boolean | null>(null);
  const [play, setPlay] = useState(false);

  const canEmbed = !!video.videoId && video.verified && thumbOk !== false;
  const searchUrl = `https://www.youtube.com/results?search_query=${encodeURIComponent(video.searchQuery)}`;

  return (
    <div className="card stack stack-8">
      <div className="row-between">
        <strong className="small">{video.title}</strong>
        <span className="badge tiny">{video.lang === 'ko' ? '한국어' : 'EN'}</span>
      </div>
      <span className="tiny muted">{video.channel}{video.minutes ? ` · ${video.minutes}분` : ''}</span>

      {canEmbed && video.videoId ? (
        play ? (
          <div style={{ position: 'relative', paddingTop: '56.25%', borderRadius: 8, overflow: 'hidden' }}>
            <iframe
              src={`https://www.youtube-nocookie.com/embed/${video.videoId}?rel=0`}
              title={video.title}
              allow="accelerometer; clipboard-write; encrypted-media; picture-in-picture"
              allowFullScreen
              loading="lazy"
              style={{ position: 'absolute', inset: 0, width: '100%', height: '100%', border: 0 }}
            />
          </div>
        ) : (
          <button className="btn btn-sm" onClick={() => setPlay(true)}>
            ▶ 영상 재생
            <img
              src={`https://i.ytimg.com/vi/${video.videoId}/default.jpg`}
              alt="" width={1} height={1} style={{ display: 'none' }}
              onLoad={(e) => setThumbOk((e.currentTarget.naturalWidth || 0) > 2)}
              onError={() => setThumbOk(false)}
            />
          </button>
        )
      ) : (
        <a className="btn btn-sm" href={searchUrl} target="_blank" rel="noopener noreferrer">
          유튜브에서 찾기 ↗
        </a>
      )}

      <p className="small dim" style={{ margin: 0 }}>{video.takeaway}</p>
      {video.prereq && <p className="tiny muted" style={{ margin: 0 }}>먼저 알아야 할 것: {video.prereq}</p>}

      {!canEmbed && (
        <p className="tiny muted" style={{ margin: 0 }}>
          링크 생존을 확인하지 못해 직접 임베드하지 않습니다. 검색어: <code className="tiny">{video.searchQuery}</code>
        </p>
      )}
    </div>
  );
}
