/**
 * 「Jazzytory 사용법」 가이드 영상.
 *
 * 오리지널 강의 51편(LECTURES)과 같은 Lecture 모양을 쓰지만 그 배열에는 넣지 않는다.
 * 어느 차시에도 속하지 않고, 진도 카운터(n/51)에도 들어가면 안 되기 때문이다.
 * 영상 파일은 앱과 함께 배포되므로 src/poster 에 base 경로를 붙여 준다.
 */
import raw from './guide.json';
import type { Lecture } from './lectures';

const base = import.meta.env.BASE_URL || '/';

export const GUIDE: Lecture = {
  ...(raw as unknown as Lecture),
  src: `${base}${raw.src}`,
  poster: `${base}${raw.poster}`,
};
