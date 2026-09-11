import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// 정적 호스팅에서 서브패스로 배포할 때는 JAZZYTORY_BASE 로 base 를 넘긴다.
//   JAZZYTORY_BASE=/Jazzytory/ npm run build
const base = process.env.JAZZYTORY_BASE ?? '/';

export default defineConfig({
  plugins: [react()],
  base,
  build: {
    target: 'es2022',
    chunkSizeWarningLimit: 900,
    rolldownOptions: {
      output: {
        // 콘텐츠 데이터는 릴리스마다 바뀌지만 벤더는 거의 안 바뀐다.
        // 갈라두면 재방문 시 벤더 청크가 캐시에서 온다.
        manualChunks(id: string) {
          if (id.includes('node_modules')) return 'vendor';
          // 커리큘럼 본문은 릴리스마다 바뀌지만 벤더는 거의 안 바뀐다.
          // 갈라두면 재방문 시 벤더 청크가 캐시에서 온다.
          //
          // 레벨별로 더 잘게 쪼개는 것은 지금 구조에서 효과가 없다 —
          // data/index.ts 가 모든 모듈 파일을 정적 import 하므로 로드 조건이 같고,
          // 번들러가 다시 하나로 합친다. 진짜로 나누려면 콘텐츠 로딩을
          // 동적 import 로 바꿔야 한다 (docs/07-ROADMAP.md 참조).
          if (id.includes('/src/data/')) return 'content';
          return undefined;
        },
      },
    },
  },
});
