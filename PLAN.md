# PLAN.md — Urban Stack 4주 개발 플랜

## 목표
4주 안에 itch.io에 출시 가능한 HTML5 퍼즐 게임 완성

## 마일스톤 요약
| 주차 | 목표 | 완료 기준 |
|---|---|---|
| Week 1 | 코어 로직 구현 | 브라우저에서 블록 배치 가능 |
| Week 2 | 라운드 시스템 완성 | 4라운드 플레이 가능 |
| Week 3 | 폴리싱 | 비주얼/사운드 완성 |
| Week 4 | 출시 | itch.io 업로드 완료 |

---

## Week 1 — 코어 구현 (Day 1~7)
**목표: 블록을 그리드에 배치하는 핵심 루프 동작**

### 구현 항목
- [ ] `index.html` — Phaser CDN 로드, 기본 캔버스 설정
- [ ] `src/config.js` — 그리드 크기, 블록 색상, 점수 상수 정의
- [ ] `src/objects/Tetromino.js` — 7종 테트로미노 형태 정의
- [ ] `src/objects/Grid.js` — 5×9 그리드 상태 관리, 배치 유효성 검사
- [ ] `src/objects/CardDeck.js` — 덱 생성, 셔플, 뽑기 로직
- [ ] `src/scenes/GameScene.js` — 기본 게임 루프 (카드 뽑기 → 열 선택 → 배치)

### 완료 기준
브라우저에서 블록을 열에 배치하고, 그리드에 쌓이는 것이 보임

---

## Week 2 — 라운드 시스템 + 점수 (Day 8~14)
**목표: 4라운드 완전한 게임 흐름 동작**

### 구현 항목
- [ ] `src/objects/ScoreBoard.js` — 라운드별 점수판 레이아웃 정의 (4종)
- [ ] `GameScene.js` 업데이트 — 라운드 시작/종료 로직
- [ ] 점수 계산 로직 — 보너스 칸 덮기, 빈 칸 페널티
- [ ] 라운드 결산 화면 — 라운드별 획득 점수 표시
- [ ] 최종 결과 화면 — 총점 + 등급 표시
- [ ] `src/scenes/UIScene.js` — 점수, 라운드, NEXT 블록 표시

### 완료 기준
타이틀 없이도 4라운드 완주하고 최종 점수가 나옴

---

## Week 3 — 폴리싱 (Day 15~21)
**목표: 출시해도 부끄럽지 않은 품질**

### 구현 항목
- [ ] `src/scenes/MenuScene.js` — 타이틀 화면, START 버튼
- [ ] 블록 비주얼 업그레이드 — 빌딩 느낌의 스프라이트 or 셰이더
- [ ] 배경 디자인 — 도시 스카이라인 배경
- [ ] 블록 슬라이딩 애니메이션 (Phaser Tween)
- [ ] 점수 팝업 애니메이션
- [ ] 효과음 추가 — 배치음, 보너스음, 라운드 전환음 (freesound.org)
- [ ] 모바일 터치 대응 확인
- [ ] 플레이테스트 2~3명 진행 + 피드백 반영

### 완료 기준
처음 보는 사람이 설명 없이 플레이 가능함

---

## Week 4 — 출시 준비 (Day 22~28)
**목표: itch.io 라이브**

### 구현 항목
- [ ] 버그 수정 & 엣지케이스 처리
- [ ] 용량 최적화 (목표: 10MB 이하)
- [ ] itch.io 페이지 에셋 제작:
  - [ ] 커버 이미지 (630×500px)
  - [ ] 스크린샷 3~5장
  - [ ] 짧은 플레이 GIF (선택)
- [ ] itch.io 페이지 작성:
  - [ ] 영어 게임 설명
  - [ ] 태그 설정: puzzle, casual, tetris, solitaire, board-game, city-builder
  - [ ] 가격: Free (Pay What You Want)
- [ ] HTML5 빌드 zip 업로드 & 브라우저 테스트
- [ ] 출시 🚀
- [ ] 홍보:
  - [ ] Reddit: r/indiegaming, r/WebGames, r/puzzlevideogames
  - [ ] X(트위터) 플레이 영상 공유
  - [ ] itch.io 커뮤니티 게시판 출시 알림

---

## 리스크 & 대응
| 리스크 | 대응 |
|---|---|
| Week 1 코어 구현 지연 | 점수 시스템 단순화 (보너스 칸 제거) |
| 비주얼 작업 시간 초과 | 단색 블록으로 출시, 업데이트로 개선 |
| 플레이테스트 피드백 과다 | 핵심 피드백 3개만 반영, 나머지는 v1.1로 |
| itch.io 빌드 오류 | Week 3에 업로드 테스트 미리 진행 |

## 참고 링크
- Phaser 3 공식 문서: https://photonstorm.github.io/phaser3-docs/
- Phaser 3 예제: https://phaser.io/examples
- 무료 효과음: https://freesound.org
- 무료 폰트: https://fonts.google.com
- itch.io 업로드 가이드: https://itch.io/docs/creators/html5
