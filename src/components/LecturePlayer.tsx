import { useEffect, useRef, useState } from 'react';
import { formatTime, type Lecture } from '../data/lectures';
import { useApp } from '../state';

const POS_KEY = (id: string) => `jazzytory:lecture-pos:${id}`;
/** 이 비율 이상 보면 시청 완료로 친다 — 끝 크레딧까지 기다리게 하지 않는다 */
const WATCHED_RATIO = 0.9;

function readPos(id: string): number {
  try { return Number(localStorage.getItem(POS_KEY(id))) || 0; } catch { return 0; }
}
function writePos(id: string, sec: number) {
  try {
    if (sec > 0) localStorage.setItem(POS_KEY(id), String(Math.floor(sec)));
    else localStorage.removeItem(POS_KEY(id));
  } catch { /* 프라이빗 모드 — 이어보기만 포기한다 */ }
}

/** 시각 t 에서 재생 중인 항목의 인덱스 (정렬된 목록 가정) */
function indexAt(list: { t: number }[], t: number): number {
  let i = -1;
  for (let k = 0; k < list.length && list[k].t <= t + 0.05; k++) i = k;
  return i;
}

/**
 * 오리지널 강의 플레이어.
 * 네이티브 <video> 를 그대로 쓴다 — iPhone 은 전체화면 플레이어, iPad 는 PiP·전체화면 버튼이
 * 브라우저 기본으로 붙는다. 자동재생은 하지 않는다(iOS 는 소리 있는 자동재생을 막는다).
 * 강의가 바뀌면 상태를 새로 시작하도록 호출부에서 key={lecture.id} 를 준다.
 */
export default function LecturePlayer({ lecture }: { lecture: Lecture }) {
  const { state, markLectureWatched } = useApp();
  const videoRef = useRef<HTMLVideoElement>(null);
  const scriptRef = useRef<HTMLOListElement>(null);
  const lastSaved = useRef(0);
  const [time, setTime] = useState(0);
  const [resumeAt, setResumeAt] = useState(() => readPos(lecture.id));
  const [scriptOpen, setScriptOpen] = useState(false);
  const watched = state.watchedLectures.includes(lecture.id);

  // iOS 는 preload 를 무시하므로 메타데이터가 없을 수 있다 → 로드된 뒤에 위치를 옮긴다
  const seek = (t: number, play = true) => {
    const v = videoRef.current;
    if (!v) return;
    const go = () => { v.currentTime = t; setTime(t); };
    if (v.readyState >= 1) go();
    else v.addEventListener('loadedmetadata', go, { once: true });
    if (play) void v.play().catch(() => {});
  };

  const onTimeUpdate = () => {
    const v = videoRef.current;
    if (!v) return;
    setTime(v.currentTime);
    if (Math.abs(v.currentTime - lastSaved.current) >= 5) {
      lastSaved.current = v.currentTime;
      writePos(lecture.id, v.currentTime);
    }
    const dur = v.duration || lecture.durationSec;
    if (!watched && dur && v.currentTime / dur >= WATCHED_RATIO) markLectureWatched(lecture.id);
  };

  const onPause = () => {
    const v = videoRef.current;
    if (v && !v.ended) writePos(lecture.id, v.currentTime);
  };

  const onEnded = () => {
    writePos(lecture.id, 0);
    setResumeAt(0);
    markLectureWatched(lecture.id);
  };

  const chapterIdx = indexAt(lecture.chapters, time);
  const lineIdx = indexAt(lecture.transcript, time);

  // 현재 문장을 자막 상자 안에서만 따라간다 (페이지 스크롤은 건드리지 않는다)
  useEffect(() => {
    const box = scriptRef.current;
    if (!scriptOpen || !box || lineIdx < 0) return;
    const el = box.children[lineIdx] as HTMLElement | undefined;
    if (!el) return;
    const top = el.offsetTop - box.offsetTop;
    if (top < box.scrollTop || top + el.offsetHeight > box.scrollTop + box.clientHeight) {
      box.scrollTo({ top: Math.max(0, top - box.clientHeight / 3), behavior: 'smooth' });
    }
  }, [lineIdx, scriptOpen]);

  const canResume = resumeAt > 10 && resumeAt < lecture.durationSec - 15 && time < 1;

  return (
    <section className="lecture card card-feature stack stack-12" aria-label="강의 영상">
      <div className="row-between">
        <div className="row" style={{ gap: 8 }}>
          <span className="badge badge-accent">강의 영상</span>
          <span className="tiny muted">Jazzytory 오리지널 · {formatTime(lecture.durationSec)}</span>
          {watched && <span className="badge badge-ok tiny">✓ 시청 완료</span>}
        </div>
      </div>
      <h2 style={{ margin: 0 }}>{lecture.title}</h2>
      {lecture.summary && <p className="small dim" style={{ margin: 0 }}>{lecture.summary}</p>}

      <div className="lecture-frame">
        <video
          ref={videoRef}
          src={lecture.src}
          poster={lecture.poster}
          controls
          playsInline
          preload="metadata"
          onTimeUpdate={onTimeUpdate}
          onPause={onPause}
          onEnded={onEnded}
        >
          이 브라우저는 영상 재생을 지원하지 않습니다. <a href={lecture.src}>영상 파일 열기</a>
        </video>
      </div>

      {canResume && (
        <div className="row">
          <button type="button" className="btn btn-primary btn-sm" onClick={() => seek(resumeAt)}>
            ▶ 이어보기 {formatTime(resumeAt)}
          </button>
          <button type="button" className="btn btn-ghost btn-sm" onClick={() => { writePos(lecture.id, 0); setResumeAt(0); }}>
            처음부터
          </button>
        </div>
      )}

      {lecture.chapters.length > 0 && (
        <nav aria-label="챕터">
          <ol className="lecture-chapters">
            {lecture.chapters.map((c, i) => (
              <li key={i}>
                <button
                  type="button"
                  className={i === chapterIdx ? 'active' : ''}
                  aria-current={i === chapterIdx ? 'true' : undefined}
                  onClick={() => seek(c.t)}
                >
                  <span className="mono tiny">{formatTime(c.t)}</span>
                  <span className="small">{c.title}</span>
                </button>
              </li>
            ))}
          </ol>
        </nav>
      )}

      {lecture.transcript.length > 0 && (
        <div className="stack stack-8">
          <button
            type="button"
            className="btn btn-sm"
            aria-expanded={scriptOpen}
            aria-controls={`script-${lecture.id}`}
            onClick={() => setScriptOpen((o) => !o)}
          >
            {scriptOpen ? '스크립트 접기' : `스크립트 펼치기 (${lecture.transcript.length}문장)`}
          </button>
          {scriptOpen && (
            <ol id={`script-${lecture.id}`} ref={scriptRef} className="lecture-script">
              {lecture.transcript.map((l, i) => (
                <li key={i}>
                  <button
                    type="button"
                    className={i === lineIdx ? 'active' : ''}
                    aria-current={i === lineIdx ? 'true' : undefined}
                    onClick={() => seek(l.t)}
                  >
                    <span className="mono tiny muted">{formatTime(l.t)}</span>
                    <span>{l.text}</span>
                  </button>
                </li>
              ))}
            </ol>
          )}
        </div>
      )}
    </section>
  );
}
