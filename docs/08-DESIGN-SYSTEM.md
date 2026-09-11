# 디자인 시스템

담당: `design-system-engineer`
단일 구현 파일: `src/styles/app.css` (런타임 CSS 프레임워크 없음, 순수 CSS)

---

## 컨셉

**어두운 연습실, 빛나는 건반.**

조명이 낮은 방에 악기 하나가 켜져 있다. UI 는 그 방의 어둠이고, 화면에서 가장 밝은 것은
**건반과 코드 심볼**이다. 배경은 물러나고 악보가 앞으로 나온다. 재즈 클럽 클리셰
(네온 사인, 색소폰 실루엣, 보라-핑크 그라디언트)는 쓰지 않는다. 참조점은 재즈 앨범 재킷이
아니라 **음악 프로덕션 도구**다 — 검은 표면, 계기판 숫자, 확신 있는 단색 강조, 물리적인 컨트롤.
그래서 다크가 기본값이고 라이트는 완전히 지원되는 대안이다.

한국어 가독성은 어떤 스타일 결정보다 우선한다. 본문 `line-height: 1.75`, `word-break: keep-all`
은 협상 대상이 아니다.

---

## 테마 구조

```
:root                                      → 다크 팔레트 완전 정의 (기본값)
@media (prefers-color-scheme: light)
  :root:not([data-theme='dark'])           → 라이트 덮어쓰기
:root[data-theme='light']                  → 라이트 덮어쓰기 (동일 내용)
```

| `data-theme` | 시스템 설정 | 결과 |
|---|---|---|
| 없음 (system) | dark | 다크 (`:root`) |
| 없음 (system) | light | 라이트 (미디어쿼리) |
| `light` | 무관 | 라이트 (`:root[data-theme='light']`) |
| `dark` | 무관 | 다크 (미디어쿼리가 `:not([data-theme='dark'])` 로 비켜남) |

`color-scheme` 은 각 테마에서 선언한다(스크롤바·폼 기본 UI가 따라온다).
**어떤 색도 미디어쿼리 안에서만 정의되지 않는다** — 라이트 블록은 두 셀렉터에 동일하게 중복 기재한다.
중복은 의도된 것이다. 한쪽만 고치면 3상태 토글 중 하나가 깨진다. **항상 두 블록을 같이 수정하라.**

---

## 색 토큰

### 표면 · 경계

| 토큰 | 역할 | 다크 | 라이트 |
|---|---|---|---|
| `--bg` | L0 캔버스 | `#0a0b0e` | `#f4f6f9` |
| `--bg-sunken` | L-1 파인 면 (푸터, 건반 뒤) | `#050609` | `#e8ecf2` |
| `--surface` | L1 카드 | `#101217` | `#ffffff` |
| `--surface-2` | L2 패널·입력 | `#161921` | `#f8fafc` |
| `--surface-3` | L3 칩·배지·버튼 | `#1e222c` | `#eef1f6` |
| `--surface-4` | L4 호버 | `#272c38` | `#e3e8f0` |
| `--border` | 기본 경계 | `#242935` | `#dee4ec` |
| `--border-strong` | 강한 경계·입력 테두리 | `#39404f` | `#bec7d6` |
| `--edge-hi` | 위쪽 1px 하이라이트 | `rgb(255 255 255 / .07)` | `rgb(255 255 255 / .9)` |
| `--edge-lo` | 아래쪽 그림자 | `rgb(0 0 0 / .55)` | `rgb(16 21 31 / .08)` |
| `--scrim` | 글래스 헤더 배경 | `rgb(6 7 11 / .72)` | `rgb(244 246 249 / .78)` |

### 텍스트

| 토큰 | 역할 | 다크 | 대비 | 라이트 | 대비 |
|---|---|---|---|---|---|
| `--text` | 본문·제목 | `#f0f3f8` | 17.6:1 | `#10131a` | 17.2:1 |
| `--text-2` | 보조 본문 (`.dim`) | `#b3bbc9` | 10.2:1 | `#414a59` | 8.3:1 |
| `--text-3` | 라벨·캡션 (`.muted`) | `#7d8797` | 5.4:1 | `#5d6775` | 5.3:1 |
| `--text-inverse` | 반전 | `#0a0b0e` | — | `#ffffff` | — |

### 강조 — 시그널 시안 (primary)

황동(`#9a6b1f`)을 버렸다. 이유는 아래 "설계 결정" 참조.

| 토큰 | 역할 | 다크 | 라이트 |
|---|---|---|---|
| `--accent` | 링크·활성·기본 CTA | `#39d7f2` (11.4:1) | `#0a6575` (6.2:1) |
| `--accent-hover` | 호버 | `#74e6fa` | `#084d59` |
| `--accent-press` | 눌림·막대 그라디언트 시작 | `#22bfd9` | `#063c46` |
| `--accent-soft` | 배지·칩 배경 | `#0c2a33` | `#ddf3f8` |
| `--accent-border` | 강조 경계 | `#1d5c6b` | `#8ed2e0` |
| `--accent-glow` | 조명·글로우 | `rgb(57 215 242 / .30)` | `rgb(10 101 117 / .18)` |
| `--on-accent` | 강조 칠 위 글자 | `#04181c` (10.6:1) | `#f2fdff` (6.5:1) |

### 강조 2 — 일렉트릭 아이리스 (secondary)

**용도를 제한한다**: 재생 중(`.ls-bar.playing`), 케이던스 표시(`.ls-cadence`), 라이브 알약,
피처 카드 상단 라인, 브랜드 마크 그라디언트 끝. 그 외에는 쓰지 않는다.

| 토큰 | 다크 | 라이트 |
|---|---|---|
| `--accent-2` | `#a78bff` (7.3:1) | `#5b34d6` (7.2:1) |
| `--accent-2-hover` | `#c3aeff` | `#4826b3` |
| `--accent-2-soft` | `#1b1636` | `#eae4ff` |
| `--accent-2-border` | `#3d3270` | `#bcaaf5` |
| `--accent-2-glow` | `rgb(167 139 255 / .28)` | `rgb(91 52 214 / .16)` |
| `--on-accent-2` | `#100a24` | `#ffffff` |

### 화음 역할 — 색 + 문자 라벨 + 모양

**색만으로 정보를 전달하지 않는다.** 세 겹으로 표시한다:
① 색 ② `.key-label` 문자(R / 3 / b7 / #11 …, `Keyboard.tsx` 가 렌더) ③ `::after` 모양 표식.

| 토큰 | 역할 | 모양 | 다크 | 라이트 | `--on-role` 대비 |
|---|---|---|---|---|---|
| `--role-root` | 루트 | ● 원 | `#7fb2ff` | `#1a5fc8` | 9.3 / 6.0 |
| `--role-third` | 3음 | ▲ 삼각 | `#ffa05c` | `#b04a00` | 11.1 / 5.5 |
| `--role-fifth` | 5음 | ▬ 막대 | `#95a1b5` | `#566072` | 7.7 / 6.3 |
| `--role-seventh` | 7음 | ◆ 마름모 | `#f58bd8` | `#a62383` | 8.4 / 6.6 |
| `--role-tension` | 텐션 | ■ 사각 | `#66e8b4` | `#0a7358` | 12.0 / 5.8 |
| `--role-avoid` | 어보이드 | ✕ 엑스 | `#ff6f80` | `#b01c33` | 7.5 / 6.9 |
| `--on-role` | 칠 위 글자 | — | `#07090d` | `#ffffff` | — |

### 상태

| 토큰 | 다크 | 라이트 |
|---|---|---|
| `--ok` / `--ok-soft` / `--ok-border` | `#4ade9b` / `#0a2418` / `#1d5a3d` | `#0e7a45` / `#dff3e8` / `#97d6b5` |
| `--warn` / `--warn-soft` / `--warn-border` | `#f5c24b` / `#2b2109` / `#6b5317` | `#8a5600` / `#fdf0d6` / `#e6c076` |
| `--danger` / `--danger-soft` / `--danger-border` | `#ff7a8f` / `#2c1015` / `#6e2634` | `#a61b34` / `#fce6ea` / `#f0a9b6` |

### 건반

| 토큰 | 역할 | 다크 | 라이트 |
|---|---|---|---|
| `--key-white` | 흰 건반 본체 | `#e9eef6` | `#ffffff` |
| `--key-white-top` | 흰 건반 상단 하이라이트 | `#ffffff` | `#ffffff` |
| `--key-white-shade` | 흰 건반 하단 음영 | `#b9c2d0` | `#dfe4ec` |
| `--key-white-edge` | 흰 건반 테두리 | `#7e8798` | `#b4bdcb` |
| `--key-black` | 검은 건반 본체 | `#12151c` | `#191d26` |
| `--key-black-top` | 검은 건반 윗면 | `#333a48` | `#3a4150` |
| `--key-black-shade` | 검은 건반 바닥 | `#05070b` | `#0a0d13` |
| `--key-black-edge` | 검은 건반 테두리 | `#000000` | `#05070b` |
| `--key-ink` | 흰 건반 위 음이름 | `#39404f` | `#5d6775` |
| `--key-ink-black` | 검은 건반 위 음이름 | `#aeb7c6` | `#cbd2dd` |
| `--key-active-ring` | 활성 건반 링 | `#06080c` | `#ffffff` |
| `--key-gloss` | 광택 | `rgb(255 255 255 / .30)` | `rgb(255 255 255 / .55)` |
| `--key-shade` | 눌림 그림자 | `rgb(0 0 0 / .70)` | `rgb(16 21 31 / .30)` |
| `--key-bed` | 건반이 놓인 펠트 | `#0b0d12` | `#cdd5e0` |

활성 링은 **칠과 반대 명도**다. 다크는 칠이 밝으므로 어두운 링, 라이트는 칠이 어두우므로 밝은 링.

### 기타

| 토큰 | 값(다크 / 라이트) |
|---|---|
| `--pure-white` / `--pure-black` | `#ffffff` / `#000000` (테마 불변 원시값, `color-mix` 재료) |
| `--strip-filter` | `saturate(1.45) brightness(1.55)` / `none` |

> `--strip-filter` 는 `src/data/levels.ts` 의 `accentColor` (어두운 하드코딩 색)를 인라인으로 받는
> `.level-strip` 을 다크에서 살리기 위한 것이다. 데이터 파일을 고치지 않고 테마별로 보정한다.

---

## 타이포그래피

### 폰트 스택 — 웹폰트를 쓰지 않는 이유

`docs/05-ARCHITECTURE.md` 의 첫 원칙이 **"네트워크가 끊겨도 동작해야 한다"** 이다.
외부 폰트 `@import` 는 이 원칙과 정면으로 충돌하고, 실패하면 첫 화면이 FOIT/FOUT 로 흔들린다.
그래서 웹폰트 없이 **완전한 로컬 스택**으로 간다. 성격은 폰트가 아니라 **무게·자간·스케일·수치
정렬**로 만든다.

```
--font-sans: 'Pretendard Variable', Pretendard, -apple-system, BlinkMacSystemFont,
             'Apple SD Gothic Neo', 'Segoe UI Variable Text', 'Segoe UI',
             'Noto Sans KR', 'Malgun Gothic', system-ui, sans-serif;

--font-mono: 'JetBrains Mono', 'IBM Plex Mono', ui-monospace, SFMono-Regular, 'SF Mono',
             'Cascadia Mono', 'Roboto Mono', Menlo, Consolas, 'Liberation Mono', monospace,
             'Pretendard Variable', Pretendard, 'Apple SD Gothic Neo', 'Malgun Gothic',
             'Noto Sans KR', sans-serif;
```

`--font-mono` 는 `monospace` **뒤에 한글 폰트를 다시 붙인다**. 코드 심볼 옆에 한글이 섞여도
(예: 섹션 라벨 "브리지") 글리프 폴백이 끊기지 않는다.

> 그래도 웹폰트를 도입하기로 한다면: `index.html` `<head>` 에 `preconnect` + `<link>` 를 넣고
> `--font-sans` / `--font-mono` 스택 **맨 앞에만** 추가하라. 허용 도메인은 `https://fonts.googleapis.com`
> 뿐이고, 위 폴백 스택은 한 글자도 지우지 않는다.

### 스케일

| 토큰 | 값 | 쓰는 곳 |
|---|---|---|
| `--fs-display` | `clamp(2.6rem, 1.55rem + 4.6vw, 4.5rem)` | `.display` — 히어로 |
| `--fs-h1` | `clamp(2.05rem, 1.42rem + 3.05vw, 3.6rem)` | `h1` (400px 35px → 1440px 58px) |
| `--fs-h2` | `clamp(1.35rem, 1.12rem + 1.15vw, 1.95rem)` | `h2`, `.title` |
| `--fs-h3` | `clamp(1.05rem, .99rem + .3vw, 1.2rem)` | `h3` |
| `--fs-lead` | `clamp(1.02rem, .97rem + .25vw, 1.15rem)` | `.lead` |
| 본문 | `16px` (모바일에서도 줄이지 않는다) | `body` |
| `.small` / `.tiny` | `.87rem` / `.76rem` | 보조 |

### 규칙

- **디스플레이**: `font-weight: 800`, `letter-spacing: -0.04em`(`--track-display`), `line-height: 1.08~1.16`,
  `text-wrap: balance`.
- **한국어 본문**: `line-height: 1.75`(`--lh-ko`), `word-break: keep-all`, `overflow-wrap: anywhere`.
  **절대 낮추지 않는다.** `.prose p` 는 1.8 까지 올린다.
- **수치·음악 기호**: 코드 심볼(`.chordsym`, `.ls-chord`), 로마숫자(`.roman`), 템포/BPM(`.field > label .mono`),
  음이름(`.key-label`), 마디 번호(`.ls-bar-num`), 표의 숫자(`.mono`)는 전부
  `font-family: var(--font-mono)` + `font-variant-numeric: tabular-nums`. **계기판 숫자처럼 보여야 한다.**
- `.eyebrow` 는 `text-transform: uppercase` + `letter-spacing: .08em`. 한글에는 대문자 변환이
  작용하지 않으므로 자간만 남는다(`.08em` 이 한글 가독성 한계선).
- `.lead` / `.measure` 는 `max-width: 62ch` 로 한 줄 길이를 제한한다.

---

## 표면 레이어 규칙

어두운 UI 에서 드롭섀도는 보이지 않는다. 깊이는 **표면 밝기 단계 + 1px 인셋 하이라이트**로 만든다.

```
box-shadow: inset 0 1px 0 var(--edge-hi), var(--shadow-1);
```

| 레이어 | 토큰 | 컴포넌트 |
|---|---|---|
| L-1 | `--bg-sunken` | `.sunken` `.card-inset` `.footer` `.keyboard-scroll` |
| L0 | `--bg` | `body` / 페이지 캔버스 |
| L1 | `--surface` | `.card` `.card-feature` `.ls-bar` |
| L2 | `--surface-2` | `.panel` `.chip` 입력 필드 `.card-link:hover` |
| L3 | `--surface-3` | `.badge` `.btn` `.kbd` `.prose code` |
| L4 | `--surface-4` | `.btn:hover` `.seg-item[aria-pressed]` |

- 한 화면에서 레이어를 **두 단계 이상 건너뛰지 않는다**.
- `--shadow-2` / `--shadow-3` 은 떠 있는 것(호버 리프트, 스킵 링크)에만.
- 조명은 `.shell::before` 의 고정 라디얼 그라디언트 2개(accent glow + accent-2 glow)로 한 번만 깔린다.

---

## 모션 규칙

| 토큰 | 값 | 용도 |
|---|---|---|
| `--dur-0` | `110ms` | 눌림(`:active`), 건반 |
| `--dur-1` | `150ms` | 색·경계·호버 |
| `--dur-2` | `200ms` | 진행 막대, 등장 |
| `--ease` | `cubic-bezier(0.2, 0.8, 0.2, 1)` | 기본 |
| `--ease-out` | `cubic-bezier(0.16, 1, 0.3, 1)` | 등장 |

- 움직이는 것: 카드 호버 리프트(−2px), 버튼 눌림(+1px, scale .995), 건반 눌림(+2px),
  `.ls-bar` 호버(−1px), 링크 화살표(+3px), 포커스 링.
- `transform`/`opacity`/`filter` 위주로만 애니메이션한다. `width` 는 `.bar` 예외.
- `prefers-reduced-motion: reduce` 에서 모든 duration 을 `.01ms` 로 죽이고,
  **이동 자체를 없앤다**(`.card-link:hover`, `.ls-bar:hover`, `.lift:hover`, `.card-flat:hover`, `.link-arrow`).

---

## 클래스 목록

### 기존 클래스 (전부 유지됨 — 87개)

`shell` `wrap` `page` `stack` `stack-4/8/12/16/24/32` `row` `row-between` `spacer`
`grid` `grid-2/3/4` `topbar` `topbar-inner` `brand` `brand-mark` `nav` (+ `nav a.active`)
`card` `card-tight` `card-link` `panel` `sunken` `btn` `btn-primary` `btn-ghost` `btn-sm`
`btn-lg` `btn-row` `badge` `badge-accent` `badge-ok` `badge-warn` `badge-danger` `chips`
`chip` `muted` `dim` `small` `tiny` `mono` `lead` `eyebrow` `center` `nowrap` `chordsym`
`roman` `bar` `bar-ok` `table-scroll` `data` `field` `switch` `note` `note-warn` `note-danger`
`keyboard-scroll` `keyboard` `key-white` `key-black` `key-on` `key-role-R/3/5/7/T/A` `key-label`
`leadsheet` `ls-section` `ls-section-label` `ls-bars` `ls-bar` (+ `.active` `.playing`)
`ls-bar-num` `ls-chord` `ls-cadence` `level-strip` `footer` `skip` `sr-only` `prose`

동작이 달라진 곳 (마크업 수정 불필요, 의도된 개선):

- `.card-link` 가 `.stack` / `.row` / `.row-between` 와 함께 오면 `display:flex` 로 복구된다.
  기존에는 `display:block` 이 이겨서 `gap` 이 통째로 무시되고 있었다.
- `.row > .bar` 는 `flex: 1 1 auto` 로 남는 폭을 채운다(기존엔 0폭으로 찌그러졌다).
- `.chip[aria-pressed='true']` 앞에 `✓` 가 붙는다(색 외 표식).
- `.nav a.active` 아래에 2px 밑줄이 붙는다(색 외 표식).
- `.keyboard-scroll` 이 테두리·펠트 배경을 가진 "케이스"가 된다.

### 신규 클래스

#### 레이아웃

| 클래스 | 용도 |
|---|---|
| `.stack-20` `.stack-40` `.stack-56` | 더 큰 수직 간격 (섹션 사이) |
| `.row-top` | `.row` 를 `align-items: flex-start` 로 |
| `.row-tight` | `.row` gap 6px |
| `.row-nowrap` | 줄바꿈 없는 행 |
| `.fill` | `flex: 1 1 auto; min-width: 0` |
| `.shrink-0` | `flex: 0 0 auto` |
| `.grid-5` | 최소 148px 자동 격자 |
| `.grid-asym` | **1.55fr / 1fr 비대칭 2열**. 격자 반복을 깨는 핵심. 860px 이하 1열 |
| `.grid-split` | 균등 2열. 860px 이하 1열 |
| `.span-2` `.span-full` | 격자 아이템 확장 |
| `.scroll-x` | 범용 가로 스크롤 컨테이너 |
| `.section-head` | 제목 + 우측 액션 (baseline 정렬) |
| `.rule` `.rule-accent` | 1px 구분선 / 강조색 페이드 구분선 |
| `.sticky-top` | `top: 74px` 고정. 900px 이하 해제 |

#### 표면 · 카드 위계

| 클래스 | 용도 |
|---|---|
| `.card-feature` | **한 화면에 하나.** 큰 패딩(최대 38px), `--radius-lg`, 좌상단 글로우, 상단에 시안→아이리스 1px 라인. 히어로/오늘의 세션용 |
| `.card-flat` | 배경·테두리 없음. 왼쪽 2px 레일만. 호버 시 레일이 강조색으로 바뀌고 들여쓰기가 커진다. 목록형 |
| `.card-inset` | 파인 카드 (`--bg-sunken` + 인셋 그림자) |
| `.card-outline` | 점선 테두리. "아직 없음" 빈 상태용 |
| `.surface-glow` | 임의 컨테이너 뒤에 강조색 조명. 자식은 자동으로 `z-index: 1` |
| `.panel-accent` | 강조색 경계 + 위에서 내려오는 soft 그라디언트 패널 |

#### 타이포

| 클래스 | 용도 |
|---|---|
| `.display` | 히어로 전용. `--fs-display`(최대 4.5rem), weight 800, 자간 −0.04em |
| `.title` | h2 크기의 비-제목 텍스트 |
| `.eyebrow-accent` | 강조색 eyebrow. 앞에 16px 대시가 붙는다 |
| `.tabular` | `font-variant-numeric: tabular-nums` 만 |
| `.measure` / `.measure-narrow` | `max-width: 62ch` / `44ch` |
| `.balance` | `text-wrap: balance` |
| `.truncate` | 한 줄 말줄임 |
| `.text-accent` `.text-accent2` `.text-ok` `.text-warn` `.text-danger` `.text-strong` | 색 유틸 |
| `.link-arrow` | `→` 가 붙고 호버 시 3px 미끄러지는 링크 |
| `.chordsym-lg` | 큰 코드 심볼 (최대 2.6rem). 랩·차트 헤더 |
| `.chordsym-chip` | 코드 심볼을 칩으로. `.prose .chordsym` / `.lead .chordsym` 에 자동 적용됨 |
| `.kbd` | 키캡 |

#### 데이터

| 클래스 | 용도 |
|---|---|
| `.marquee-stat` | **계기판 대문자 숫자.** 모노 800, 최대 3.4rem, tabular-nums. 내부 `<small>` 또는 `.unit` 은 단위 |
| `.stat` `.stat-value` `.stat-label` `.stat-sub` | 통계 블록 한 세트 (기존 Home 의 `Stat` 컴포넌트와 1:1 대응) |
| `.bar-lg` `.bar-sm` `.bar-accent2` | 막대 변종 |
| `.badge-accent2` `.badge-lg` `.badge-outline` | 배지 변종 |
| `.pill` `.pill-live` | 상태 알약 / 재생 중 알약 |
| `.dot` `.dot-accent` `.dot-ok` `.dot-warn` `.dot-danger` | 상태 점. **색 + 모양**(원/원/원/사각/삼각)으로 구분 |

#### 버튼 · 컨트롤

| 클래스 | 용도 |
|---|---|
| `.btn-accent2` | 보조 강조 채움 버튼 |
| `.btn-danger` | 파괴적 동작 (데이터 삭제) |
| `.btn-block` | 전폭 버튼 |
| `.btn-icon` | 36×36 정사각 아이콘 버튼 |
| `.seg` `.seg-item` | 분절 컨트롤. `aria-pressed="true"` 또는 `.active` 로 선택 표시 |
| `.lift` `.press` | 호버 리프트 / 눌림 모션만 필요할 때 |
| `.pulse` `.reveal` | 깜빡임 / 8px 올라오며 등장 |

#### 음악

| 클래스 | 용도 |
|---|---|
| `.chart-scroll` | 코드 차트 전용 가로 스크롤 컨테이너. 본문이 아니라 **여기서만** 가로로 넘친다 |
| `.role-legend` | 건반 아래 역할 범례 래퍼 |
| `.role-key` + `.is-R/3/5/7/T/A` | 범례 항목. 역할별 `--role` 을 세팅 |
| `.role-mark` | 범례 안의 모양 표식. 부모 `.is-*` 에 따라 원/삼각/막대/마름모/사각/엑스로 바뀐다 |

`.role-legend` 사용 예 (마크업은 담당자가 넣는다):

```html
<div class="role-legend">
  <span class="role-key is-R"><i class="role-mark"></i>R 루트</span>
  <span class="role-key is-3"><i class="role-mark"></i>3 3음</span>
  <span class="role-key is-7"><i class="role-mark"></i>7 7음</span>
  <span class="role-key is-T"><i class="role-mark"></i>T 텐션</span>
  <span class="role-key is-A"><i class="role-mark"></i>A 어보이드</span>
</div>
```

---

## 캐스케이드 순서 (파일 구조)

```
1  토큰 (다크 → 라이트 오버라이드)
2  리셋 · 기본 타이포
3  레이아웃 프리미티브
4  표면
5  크롬 (헤더 · 푸터 · 스킵)
6  버튼
7  배지 · 칩 · 알약
8  데이터 (막대 · 표 · 통계 · 레벨)
9  폼
10 알림
11 건반
12 리드시트 · 코드 차트
13 음악 타이포 · 본문
14 타이포 유틸     ← 반드시 컴포넌트 뒤. `.ls-chord muted` 에서 `.muted` 가 이겨야 한다
15 모션 유틸
16 접근성 보조
17 반응형
18 사용자 설정(reduced-motion, contrast)
```

**타이포 유틸(`.muted` `.dim` `.small` `.tiny` `.mono` `.lead` `.eyebrow`)은 항상 마지막에 둔다.**
`.badge tiny`, `.ls-chord muted`, `.chip mono` 같은 조합이 전부 이 순서에 의존한다.

---

## 반응형

| 폭 | 변화 |
|---|---|
| ≤ 900px | `.sticky-top` 해제 |
| ≤ 860px | `.grid-asym` / `.grid-split` 1열, `.span-2` 해제 |
| ≤ 720px | `--gutter: 16px`, 헤더 2줄(nav 가 전폭으로 내려감), 카드 패딩 축소 |
| ≤ 560px | `.ls-bars` 4열 → **2열**, 격자 gap 12px |
| ≤ 420px | `--gutter: 14px`, `.ls-bar` 축소, `.keyboard-scroll` 패딩 축소 |

본문 `font-size` 는 모바일에서도 **16px 그대로**다(한국어 가독성 우선).

### 400px 가로 스크롤 방지 규칙

1. 모든 `.grid-*` 는 `minmax(min(100%, N px), 1fr)` — 컨테이너보다 큰 최소폭을 갖지 않는다.
2. `.stack` `.row` `.row-between` `.grid` `.wrap` `.page` `.card` `.panel` 에 `min-width: 0`
   (플렉스/그리드 아이템의 기본 `min-width: auto` 가 긴 모노 문자열에서 터지는 것을 막는다).
3. `body { overflow-wrap: anywhere }` 로 긴 영문/코드 문자열을 강제 줄바꿈.
4. 가로 스크롤이 **허용되는 곳은 4군데뿐**:
   `.keyboard-scroll`, `.table-scroll`, `.chart-scroll` / `.scroll-x`, `.nav`.
5. 최후의 안전망: `html, body { overflow-x: clip }`.
   `clip` 은 스크롤 컨테이너를 만들지 않으므로 `.topbar` 의 `position: sticky` 가 살아남는다
   (`hidden` 을 쓰면 sticky 가 깨진다 — **바꾸지 말 것**).

---

## 접근성 체크리스트

### 대비

- [x] 본문 텍스트 ≥ 4.5:1 — `--text` 17.6:1 / `--text-2` 10.2:1 / `--text-3` 5.4:1 (다크 기준)
- [x] 라이트에서도 동일 — `--text-3` 5.3:1
- [x] 링크(`--accent`) 다크 11.4:1, 라이트 6.2:1
- [x] 채움 버튼 글자(`--on-accent` on `--accent`) 다크 10.6:1, 라이트 6.5:1
- [x] 상태색 전부 ≥ 5.4:1 (자기 `-soft` 배경 위에서도 ≥ 5:1)
- [x] 화음 역할 칠 위 글자(`--on-role`) 최소 5.5:1
- [x] 푸터(13.6px 작은 글자)는 `--text-2` 사용 — 7.2:1 이상

### 색 외 표식 (색만으로 정보 전달 금지)

- [x] 건반 역할 = 색 **+ 문자 라벨 + 모양**(● ▲ ▬ ◆ ■ ✕)
- [x] 활성 건반 = **명도 차이 + 2겹 테두리 + 글로우** (채도만으로 구분하지 않음)
- [x] 현재 내비게이션 = 색 + **밑줄**
- [x] 선택된 칩 = 색 + **✓**
- [x] 눌린 버튼 = 색 + **안쪽 링** (+ 문구 변화)
- [x] 선택된 마디(`.ls-bar.active`) = 색 + **왼쪽 레일**
- [x] 재생 중 마디(`.ls-bar.playing`) = 색 + **▶ 글리프**
- [x] 스위치 = **네이티브 체크 표시**(모양). `appearance: none` + `::after` 는 Firefox 에서
      렌더되지 않으므로 쓰지 않는다
- [x] 상태 점 `.dot-*` = 색 + 모양(원/사각/삼각)
- [x] 배지 = 색 + 텍스트 라벨

### 포커스

- [x] `:focus-visible { outline: 2px solid var(--accent); outline-offset: 3px }`
- [x] 건반은 `outline-offset: -3px` (스크롤 컨테이너에 잘리지 않게)
- [x] `.card-link` 는 `outline-offset: 4px`
- [x] 라우트 전환 시 포커스되는 `h1[tabindex="-1"]` 은 `:focus` 무시, `:focus-visible` 만 표시
- [x] `.skip` 스킵 링크 — 포커스 시 좌상단에 나타남
- [x] 포커스 링이 `border-radius` 를 강제로 바꾸지 않는다 (구버전의 버그 제거)

### 모션

- [x] 모든 전환 150~200ms
- [x] `prefers-reduced-motion: reduce` 에서 duration 0 + **이동 자체 제거**
- [x] 무한 애니메이션(`.pulse`)은 reduced-motion 에서 1회로 제한

### 기타

- [x] `color-scheme` 선언 → 스크롤바·네이티브 폼이 테마를 따른다
- [x] `prefers-contrast: more` 지원 — 경계 강화, `--text-3` → `--text-2`, 포커스 링 3px
- [x] `.sr-only` 는 `clip` + `clip-path` 병행
- [x] 최소 터치 타겟: `.btn` 38px, `.chip` 34px, `.btn-lg` 50px, 흰 건반 34×132px
- [x] 폰트 크기는 모바일에서도 16px 이상 (확대 없이 읽힘)

---

## 설계 결정 3가지

### 1. 다크를 `:root` 로 뒤집었다

악기는 어둡다. Ableton, Logic, Serato, Spotify — 음악을 만들고 듣는 도구는 전부 어두운 표면
위에 밝은 계기가 떠 있다. 라이트를 기본으로 두면 "문서 사이트"의 인상을 절대 벗을 수 없다.
다크를 기본으로 하면 건반과 코드 심볼이 자동으로 화면에서 가장 밝은 요소가 되고,
이는 이 제품의 컨셉("악보와 건반이 주인공")과 정확히 일치한다.
라이트는 버리지 않는다 — 밝은 연습실·주간 학습을 위해 완전히 지원하되, 기본값의 자리는 내준다.

### 2. 강조색은 "황동 → 시그널 시안 + 아이리스"

황동(`#9a6b1f`)은 재즈의 관습적 색이고, 낮은 채도의 갈색-금색이라 어두운 UI 에서
거의 빛나지 않는다. 시안(`#39d7f2`)을 고른 이유는 세 가지다.
① 밝기: 다크 배경 대비 11.4:1 로 링크·활성 상태를 색만으로도 충분히 밝게 만들면서,
흰 건반(`#e9eef6`)보다는 어두워서 **건반의 주인공 자리를 빼앗지 않는다**.
② 충돌 없음: `--ok`(초록) `--warn`(황색) `--danger`(적색)와 색상환에서 멀다.
오렌지나 라임을 골랐다면 "경고"와 헷갈렸을 것이다.
③ 양쪽 테마에서 같은 성격을 유지: 라이트에서 `#0a6575` 로 어두워져도 같은 계열로 읽힌다.
보조색 아이리스(`#a78bff`)는 **시간축(재생 중·케이던스)에만** 쓴다 — 용도를 좁혀야 그라디언트 남용을 막는다.

### 3. 활성 건반은 색이 아니라 "명도 + 2겹 테두리 + 모양"으로 말한다

색각 이상(남성의 약 8%)에서 6가지 역할색을 색상만으로 구분하는 것은 불가능하다.
그래서 활성 건반은 ① 주변 건반과 **명도가 확연히 다른** 칠 ② 칠과 반대 명도의 2px 안쪽 링
③ 한 겹 더 어두운 바깥 1px 테두리 ④ `Keyboard.tsx` 가 이미 그리는 문자 라벨(R/3/b7/#11)
⑤ 역할마다 다른 CSS 모양 표식(● ▲ ▬ ◆ ■ ✕) — 총 다섯 겹으로 표시한다.
색은 그중 하나일 뿐이고, 색을 전부 지워도 정보가 남는다.
이 원칙을 칩(✓), 내비게이션(밑줄), 재생 중 마디(▶), 상태 점(모양)까지 전부 확장했다.

---

## 하지 말 것

- 하드코딩된 색. 모든 색은 `:root` 토큰을 거친다 (`color-mix()` 재료로 `--pure-black` / `--pure-white` 사용).
- 라이트 팔레트를 한쪽 셀렉터에서만 고치기 (미디어쿼리 + `[data-theme='light']` 둘 다 고쳐야 한다).
- 타이포 유틸을 컴포넌트 앞으로 옮기기.
- 한국어 `line-height` 를 1.75 미만으로 낮추기, `word-break: keep-all` 제거.
- `.keyboard-scroll` / `.table-scroll` / `.chart-scroll` 바깥에서 가로 스크롤 만들기.
- `html`/`body` 의 `overflow-x: clip` 을 `hidden` 으로 바꾸기 (sticky 헤더가 죽는다).
- 색만으로 상태를 구분하는 UI 추가.
- 런타임 CSS 프레임워크(Tailwind 등) 도입.
