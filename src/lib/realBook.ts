import type { Tune } from '../data/types';

/** 「리얼북 1권(6판) 39쪽」 — 페이지를 두 색인으로 확인하지 못한 곡은 「리얼북 4권 수록」까지만 */
export function realBookLabel(rb: NonNullable<Tune['realBook']>): string {
  const ed = rb.edition ? `(${rb.edition})` : '';
  return rb.page ? `리얼북 ${rb.volume}권${ed} ${rb.page}쪽` : `리얼북 ${rb.volume}권${ed} 수록`;
}

/** 이 강의의 곡 한 줄 설명 — 리얼북 위치 · 같은 폼 리얼북 곡 · 오리지널 연습곡 */
export function tuneSourceLabel(t: Tune): string {
  if (t.realBook) return realBookLabel(t.realBook);
  if (t.realBookSameForm?.length)
    return '기본 폼 · 같은 폼 리얼북 곡: ' + t.realBookSameForm.map((x) => `${x.title} ${x.volume}권${x.edition ? `(${x.edition})` : ''} ${x.page}쪽`).join(' · ');
  if (t.composer.includes('Jazzytory')) return 'Jazzytory 오리지널 연습곡';
  return '리얼북 미수록';
}
