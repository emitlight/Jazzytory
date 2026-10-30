# 사용법 가이드 영상 제작

「Jazzytory 사용법」 한 편(`/#/guide`)을 처음부터 다시 만드는 파이프라인.
실제 화면을 캡처해 슬라이드로 깔고, 한국어 내레이션을 합성해 붙인다.

## 돌리는 법

```bash
export GUIDE_WORK=/tmp/guide          # 중간 산출물이 쌓이는 곳
export PLAYWRIGHT_EXECUTABLE=/opt/pw-browsers/chromium-1194/chrome-linux/chrome  # 필요한 환경에서만

npm run build
( cd dist && python3 -m http.server 4173 ) &   # capture.mjs 가 여기를 찍는다

node scripts/guide-video/capture.mjs    # 1. 실제 UI 스크린샷 8장
node scripts/guide-video/tts.mjs        # 2. 내레이션 합성 + 타임라인
node scripts/guide-video/slides.mjs     # 3. 1920×1080 슬라이드 + 포스터
node scripts/guide-video/compose.mjs    # 4. mp4 합성
node scripts/guide-video/publish.mjs    # 5. public/guide/ 와 src/data/guide.json 갱신

npm run test && npm run build
```

대본만 고쳤다면 `tts.mjs` → `slides.mjs` → `compose.mjs` → `publish.mjs` 만 다시 돌리면 된다.
이미 합성된 문장의 음성은 캐시되므로 바뀐 줄만 새로 합성한다(`--force` 로 전부 다시).

## 파일

| 파일 | 역할 |
|---|---|
| `script.ko.mjs` | 대본. 한 줄 = 자막 1줄 = TTS 1청크 = 슬라이드 1프레임 |
| `capture.mjs` | 로컬 빌드를 크로미움으로 열어 실제 화면 캡처 |
| `tts.mjs` | 줄별 음성 합성, raw PCM 으로 길이 측정 → `timeline.json` |
| `slides.mjs` | 스크린샷 + 강조 박스 + 자막을 1920×1080 PNG 로 렌더 |
| `compose.mjs` | 슬라이드와 내레이션을 H.264/AAC faststart mp4 로 합성 |
| `publish.mjs` | 결과물을 `public/guide/` 와 `src/data/guide.json` 에 싣는다 |

## 지켜야 할 것

- **대본에 없는 UI 를 설명하지 않는다.** 버튼 이름은 실제 화면에서 확인한 것만 쓴다
  (`최우선(priority 1)만 보기` 처럼 괄호까지 그대로).
- **음성은 mp3 를 이어붙이지 않는다.** 프레임 패딩이 파일마다 쌓여 6분에 3초가 밀린다.
  `tts.mjs` 가 raw PCM 으로 풀어 샘플 단위로 길이를 재고, `compose.mjs` 가 그 PCM 을 이어 붙인다.
  `compose.mjs` 는 오디오 길이와 타임라인이 0.05초 넘게 어긋나면 실패한다.
- **영상 파일은 이 저장소에 있다.** 오리지널 강의 51편은 별도 미디어 저장소(`jazzytory-media-*`)에
  있지만 가이드는 한 편뿐이라 `public/guide/` 에 함께 둔다. 다시 만들 때마다 커밋하면
  git 이력에 11MB 씩 쌓이므로, 자주 고칠 일이 생기면 미디어 저장소로 옮기는 편이 낫다.

## 이 환경에서의 제약

- 한국어 TTS 는 `translate.googleapis.com` 을 쓴다. 샌드박스에서 닿는 유일한 한국어 음성이다
  (edge-tts 가 쓰는 `speech.platform.bing.com` 은 프록시가 막는다).
- 배경음악은 넣지 않았다. 오리지널 강의 51편이 쓰는 Kevin MacLeod 음원을
  이 환경에서 받을 수 없어서, 출처를 밝힐 수 없는 음악을 넣느니 내레이션만 뒀다.
- `emitlight.github.io` 가 막혀 있어 라이브 사이트를 직접 찍을 수 없다.
  그래서 `capture.mjs` 는 로컬 빌드를 띄워 찍고, 강의 포스터/영상 요청만 스텁으로 가로챈다.
