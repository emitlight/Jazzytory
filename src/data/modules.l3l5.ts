/**
 * Jazzytory — L3~L5 커리큘럼 모듈 배럴 (re-export)
 * ---------------------------------------------------------------------------
 * 실제 콘텐츠는 레벨별 파일에 있다.
 *  - modules.l3.ts  L3 코드 스케일과 선율
 *  - modules.l4.ts  L4 비밥 어휘와 채보
 *  - modules.l5.ts  L5 리하모니제이션
 *
 * `src/data/index.ts` 는 이 파일의 `MODULES_L3L5` 를 import 하므로
 * 이 이름을 바꾸지 않는다.
 */

import type { Module } from './types';
import { MODULES_L3 } from './modules.l3';
import { MODULES_L4 } from './modules.l4';
import { MODULES_L5 } from './modules.l5';

export { MODULES_L3, MODULES_L4, MODULES_L5 };

export const MODULES_L3L5: Module[] = [...MODULES_L3, ...MODULES_L4, ...MODULES_L5];
