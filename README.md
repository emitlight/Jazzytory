# Jazzytory 🎹

**리얼북 한 장으로 즉흥 연주까지.**

체르니 100 정도의 손은 있는데 `C-7` 앞에서 멈추는 사람을 위한, 재즈피아노 연주 전공
학부 커리큘럼 기반 웹 학습 서비스. 이론을 늘리는 게 아니라 **음표 없는 악보 앞에서
손이 움직이기까지의 시간**을 줄이는 것이 목표다.

백엔드 없음. React 19 + TypeScript + Vite. 오디오는 전부 Web Audio 합성.

---

## 3분 만에 돌려보기

```bash
npm install
npm run dev       # http://localhost:5173
```

품질 게이트:

```bash
npm run typecheck         # TypeScript strict
npm run test              # 이론 엔진 단위 테스트 + 콘텐츠 정합성
npm run validate:content  # 콘텐츠 정합성만
npm run build             # 타입체크 + 프로덕션 번들
npm run smoke             # 빌드 결과를 실제 크로미움으로 열어 전 라우트 확인
npm run verify:media      # 유튜브 링크 생존 확인 (아래 참조)
```

정적 호스팅 서브패스로 배포할 때:

```bash
JAZZYTORY_BASE=/Jazzytory/ npm run build
```

## 배포

### GitHub Pages (권장)

`.github/workflows/deploy.yml` 이 푸시마다 타입체크 → 테스트 → 빌드 → 배포를 수행한다.
게이트를 통과하지 못하면 배포하지 않는다.

**최초 1회만 저장소 소유자가 켜야 한다:**

> Settings → Pages → Build and deployment → **Source: GitHub Actions**

워크플로의 `GITHUB_TOKEN` 으로는 Pages 를 켤 수 없다
(`Resource not accessible by integration` 으로 실패한다).

**그리고 `github-pages` 환경은 기본적으로 기본 브랜치에서만 배포를 허용한다.**
기능 브랜치에서 실행하면 `build` 는 통과하지만 `deploy` 잡이 스텝 하나도 실행하지
못한 채 즉시 실패한다. 기본 브랜치에 머지하거나,
Settings → Environments → `github-pages` → Deployment branches 에 해당 브랜치를
추가해야 한다.

프로젝트 페이지 경로(`/Jazzytory/`)는 `configure-pages` 의 `base_path` 를
Vite 가 요구하는 끝 슬래시 형태로 정규화해 처리한다.

### 단일 페이지 번들

```bash
npm run build:artifact   # artifact-dist/ 에 CSS 인라인 + 상대경로 번들 생성
```

CSS 를 인라인하고 자산을 상대 경로로 참조하는 번들을 만든다.
`<html>/<head>/<body>` 없이 본문만 출력하므로 페이지를 스켈레톤으로 감싸는
호스팅(Claude Artifact 등)에 그대로 올릴 수 있다. 라우팅은 HashRouter 라
서버 리라이트가 필요 없다.

---

## 무엇이 들어 있나

| 영역 | 내용 |
|---|---|
| **커리큘럼** | 9레벨 · 51모듈. 각 모듈에 개념·드릴·레퍼토리·필청·영상·평가·검수기록 |
| **교수법** | 공개 출판물로 검증되는 재즈 교수법 18가지를 51개 모듈 전체에 84건으로 이식 |
| **이론 엔진** | 코드 심볼 파서, 철자 보존 이조, 기능 기반 코드 스케일 판정, 로마숫자 분석, ii‑V 감지 |
| **보이싱 엔진** | 셸 / 가이드톤 / 루트리스 A·B / 드롭2 / 쿼탈 / 어퍼스트럭처 / 블록 / 스프레드 — 음역 제약과 성부 진행 최소화 포함 |
| **오디오** | Web Audio 합성 피아노·더블베이스·드럼, 룩어헤드 스케줄러, 워킹베이스·컴핑 자동 생성 |
| **랩** | 보이싱 랩(12키 자동 순환) · 진행 분석 + 반주 · 코드 탐색기 · 청음 훈련 · 메트로놈(2·4박) |
| **레퍼토리** | 스탠다드 코드 차트 + Jazzytory 오리지널 연습곡. 이조·반주·마디별 분석·난구간 해법 |
| **청음** | 필청 명반 + **트랙 단위 청취 지시문** (목록이 아니라 듣는 법) |
| **진도** | 8축 숙련도, 간격 반복 복습, 인터리빙 세션 생성, 연습 로그 |
| **연습 설계** | 매개변수를 하나만 고정해 연습하는 랩(밀도·음역·여백 등 8종) |

---

## 솔직하게 밝혀 둘 것

이 저장소가 감추지 않는 세 가지.

### 1. 실제 대학 교수의 검수는 받지 않았다 — 교수법 인용과는 다른 이야기다

원 기획은 "버클리음대 등 유수 교수의 검수"를 포함했다. 실제로 구현한 것은:

- 8항목 루브릭 기반 **검수 파이프라인 자체**를 제품 기능으로 만들었다
- 콘텐츠를 버클리 프레스 등 **실존 공개 교재의 개념 체계에 정렬**하고 출처를 달았다
- 검수 패널은 **교수법 계보를 대표하는 가상의 심사 기준**이다. 실존 인물이 아니다
- 외부 검수 슬롯은 비워 두었다 (`faculty-pending` → `faculty-approved` 상태 머신 구현됨)

`src/data/content.test.ts` 가 이 정직성 규칙을 빌드 게이트에서 강제한다 —
검수자를 실존 인물로 표기하거나 실제 대학 소속으로 적으면 **테스트가 실패한다**.

교수법 페이지에 인용된 배리 해리스·트리스타노·갤퍼 등은 **공개 출판물의 저자**일 뿐
이 서비스를 승인하지 않았다. `TeachingMethod.endorsedJazzytory` 가 타입상 `false` 로
고정되어 있어 반대로 표기할 수 없다.

자세한 내용: [`docs/04-REVIEW-PROTOCOL.md`](docs/04-REVIEW-PROTOCOL.md) ·
[`docs/09-PEDAGOGY.md`](docs/09-PEDAGOGY.md)

### 2. 멜로디를 배포하지 않는다

스탠다드는 **코드 진행(화성 골격)만** 수록한다. `Tune.melodyIncluded` 는 타입상
`false` 로 고정되어 있고 테스트가 검사한다. 리얼북 스캔·PDF·가사·채보된 솔로는 없다.
음원도 호스팅하지 않는다 — 청음은 앨범 메타데이터 + 청취 지시문으로 제공한다.

일부 스탠다드는 판본에 따라 화성이 다르다. 확신이 낮은 곡은 널리 가르쳐지는 교육용
버전을 싣고 그 사실을 곡의 `approach` 에 한국어로 명시했다.

### 3. 유튜브 임베드를 검증하지 못했다

개발 환경의 네트워크 정책이 유튜브를 차단해 영상 ID 의 생존을 확인할 수 없었다.
**깨진 임베드는 없는 것보다 나쁘므로**, 추측한 ID 를 하나도 싣지 않았다.
현재 모든 영상은 `videoId: null` 이고 **채널명 + 정밀 검색어 딥링크**로 렌더링된다.

임베드를 살리려면 **두 단계**가 필요하다. 검색어를 영상 ID 로 해석하고(resolve),
그 ID 가 살아 있는지 확인한다(verify).

```bash
# 1단계 + 2단계 한 번에 — YouTube Data API 키가 필요하다
YOUTUBE_API_KEY=... npm run verify:media -- --resolve --write

# 이미 ID 가 채워져 있다면 생존 확인만
npm run verify:media -- --write
```

API 키는 [Google Cloud Console](https://console.cloud.google.com) 에서
YouTube Data API v3 를 사용 설정하고 발급한다. 무료 할당량 10,000 units/일,
`search.list` 1회당 100 units 이므로 58개 항목이면 5,800 units — 하루치 안에 든다.

**검색 1등 결과를 무조건 받아들이지 않는다.** 항목에 선언된 `channel` 과 실제 결과의
채널명이 일치할 때만 채택하고, 불일치하면 그 항목은 검색 폴백으로 남긴다 —
엉뚱한 영상을 임베드하는 것이 링크 없는 것보다 나쁘기 때문이다.

유튜브에 닿지 않는 환경에서는 아무것도 승격하지 않고 정상 종료한다 —
검증 실패와 네트워크 차단을 구분하기 위해서다.

승격 후에는 반드시 `npm test` 와 `npm run smoke` 를 다시 돌린다.

---

## 구조

```
src/
├─ data/         콘텐츠 (순수 데이터). types.ts 가 단일 타입 계약
├─ lib/          도메인 엔진 (React 를 모른다)
├─ components/   렌더링만
└─ routes/       화면 (라우트 단위 코드 분할)
docs/            기획·커리큘럼·검수·아키텍처 문서
.claude/agents/  개발 프로세스별 에이전트 정의 17종
scripts/         미디어 검증
```

`lib/` 는 `components/` 를 import 하지 않는다. `components/` 는 계산하지 않는다.

자세한 설계 결정: [`docs/05-ARCHITECTURE.md`](docs/05-ARCHITECTURE.md)

---

## 문서

| 문서 | 내용 |
|---|---|
| [`docs/00-MASTER-PROMPT.md`](docs/00-MASTER-PROMPT.md) | 마스터 스펙 — 모든 에이전트의 공통 브리프 |
| [`docs/01-PRD.md`](docs/01-PRD.md) | 제품 요구사항 · 페르소나 · 지표 |
| [`docs/02-CURRICULUM.md`](docs/02-CURRICULUM.md) | 9레벨 계열화 원리와 주리 기준 |
| [`docs/03-IA-UX.md`](docs/03-IA-UX.md) | 정보구조 · 핵심 루프 · UX 라이팅 · 접근성 |
| [`docs/04-REVIEW-PROTOCOL.md`](docs/04-REVIEW-PROTOCOL.md) | 검수 프로토콜 · 루브릭 · 정직성 규칙 |
| [`docs/05-ARCHITECTURE.md`](docs/05-ARCHITECTURE.md) | 아키텍처와 핵심 설계 결정 |
| [`docs/06-SOURCES.md`](docs/06-SOURCES.md) | 참고 문헌 · 인용 정책 · 저작권 |
| [`docs/07-ROADMAP.md`](docs/07-ROADMAP.md) | 로드맵 (v2 = MIDI 입력 채점) |
| [`docs/08-DESIGN-SYSTEM.md`](docs/08-DESIGN-SYSTEM.md) | 디자인 시스템 — 토큰·타이포·표면·모션·접근성 |
| [`docs/09-PEDAGOGY.md`](docs/09-PEDAGOGY.md) | 교수법 레이어 — 18가지 방법과 모듈 이식 규칙 |

---

## 개발 프로세스 에이전트

`.claude/agents/` 에 웹 서비스 개발 프로세스의 각 기능을 담당하는 에이전트 17종이 정의되어 있다.

기획 `product-strategist` · 학습설계 `learning-scientist` · 교육과정 `jazz-curriculum-architect` ·
집필 `jazz-theory-author` · 레퍼토리 `repertoire-curator` · 청음 `listening-curator` ·
미디어 `media-curator` · 검수 `faculty-reviewer` · UX `ux-architect` ·
디자인 `design-system-engineer` · 프론트엔드 `frontend-engineer` ·
음악엔진 `music-engine-engineer` · 오디오 `audio-engineer` · QA `qa-engineer` ·
접근성 `a11y-i18n-engineer` · 배포 `release-engineer` · 문서 `tech-writer`

각 정의는 그 역할이 **무엇을 반려하는가**까지 명시한다. 예를 들어 `repertoire-curator` 는
멜로디를 포함한 산출물을 폐기하고, `faculty-reviewer` 는 실존 인물 사칭을 금지한다.

---

## 라이선스와 범위

학습용 도구다. 교재의 개념 체계를 참조했을 뿐 어떤 기관의 승인·인증·제휴도 받지 않았다.
상업적 재배포 전에 레퍼토리 화성 데이터의 저작권 지위를 각 관할에서 별도로 검토할 것.
