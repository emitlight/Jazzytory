import { defineConfig } from 'vitest/config';

// 테스트는 순수 TS 도메인 로직만 다루므로 React 플러그인이 필요 없다.
// vite.config.ts 와 분리해 두 vite 사본 사이의 타입 충돌을 피한다.
export default defineConfig({
  test: {
    environment: 'node',
    include: ['src/**/*.test.ts'],
  },
});
