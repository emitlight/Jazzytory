# 참고 문헌과 인용 정책

담당: `jazz-theory-author` · `faculty-reviewer`

## 인용 정책

1. **모든 이론 주장에 `SourceRef` 를 붙인다.** 출처 없는 개념은 빌드가 거부한다
   (`content.test.ts` → "모든 개념에 출처가 붙어 있다").
2. **실존하는 공개 교재만 인용한다.**
3. **페이지 번호를 지어내지 않는다.** 장(chapter)/개념 수준으로 인용한다.
   확인되지 않은 페이지 번호는 거짓 정확성을 만든다.
4. **정렬(alignment)은 승인(endorsement)이 아니다.** 교재를 인용했다는 사실이
   저자나 출판사의 승인을 뜻하지 않는다.

## 주요 인용 교재

### 버클리 프레스 계열
- Joe Mulholland & Tom Hojnacki, *The Berklee Book of Jazz Harmony* (Berklee Press)
- Ray Santisi, *Berklee Jazz Piano* (Berklee Press)
- Suzanna Sifter, *Berklee Jazz Keyboard Harmony* (Berklee Press)
- Ted Pease & Ken Pullig, *Modern Jazz Voicings* (Berklee Press)

### 피아노 어법
- Mark Levine, *The Jazz Piano Book* / *The Jazz Theory Book* (Sher Music)
- Riccardo Scivales, *Jazz Piano Voicings*
- Jeremy Siskind, *Playing Solo Jazz Piano*

### 즉흥과 선율
- Hal Galper, *Forward Motion*
- Hal Crook, *How to Improvise* / *Ready, Aim, Improvise!*
- Jerry Coker, *Elements of the Jazz Language for the Developing Improvisor*
- David Baker, *How to Play Bebop*
- Jerry Bergonzi, *Inside Improvisation* 시리즈
- Gary Campbell, *Triad Pairs for Jazz*

### 이론 일반
- Bert Ligon, *Jazz Theory Resources*
- Jamey Aebersold, *Jazz Handbook* (무료 공개)
- Barry Harris 워크숍 방법론 (공개 강연·워크숍 기록)

## 저작권 준수

### 레퍼토리
- **멜로디를 배포하지 않는다.** 음표 데이터·가사·채보된 솔로 없음
- 수록 대상은 **코드 진행(화성 골격)** 뿐 — `Tune.melodyIncluded` 는 타입상 `false` 고정
- 리얼북 스캔·PDF·페이지 번호를 재현하거나 참조하지 않는다
- 오리지널 연습곡(`t-jz-*`)은 Jazzytory 창작물로 표기
- 일반 폼(블루스, 리듬 체인지 골격)은 `Traditional` 로 표기

### 음원
- 호스팅하지 않는다. 스트리밍 링크도 제공하지 않는다
- 청음은 **앨범 메타데이터 + 청취 지시문**으로만 제공

### 영상
- 공식 유튜브 임베드 플레이어만 사용 (`youtube-nocookie.com`)
- 다운로드·리호스팅·재업로드 없음
- 검증되지 않은 영상은 임베드하지 않고 검색 딥링크로 안내

## 알려진 한계

- **곡의 화성 진행에는 판본 차이가 있다.** 확신이 낮은 곡은 널리 가르쳐지는
  교육용 버전을 싣고 `approach` 에 그 사실을 한국어로 명시했다.
  해당 곡은 `accuracy` 루브릭 점수를 낮추고 `faculty-pending` 으로 표시했다.
- **영상 링크 생존을 이 환경에서 검증하지 못했다.** 그래서 모든 영상이
  `videoId: null` 이며 검색 폴백으로 렌더링된다.
