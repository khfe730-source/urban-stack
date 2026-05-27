# Urban Stack

도시 설계사가 되어 빌딩 블록을 5×9 부지에 쌓아 점수를 최대화하는 솔로 퍼즐 게임.
FITS 보드게임 메커니즘 기반의 한판 5~10분짜리 캐주얼 퍼즐.

> 🚧 개발 진행 중 — 2026년 4주 일정으로 itch.io 출시 목표

---

## 게임 컨셉

- **장르:** 퍼즐 / 캐주얼 (솔로 보드게임 디지털화)
- **목표:** 7종 테트로미노 카드를 5×9 그리드에 배치하여 점수 극대화
- **라운드:** 4라운드, 각 라운드마다 보너스/페널티 칸이 표시된 점수판이 오버레이됨
- **점수:** 보너스 칸 덮기(+2), 일반 칸(+1), 빈 칸 페널티(-1), 보너스 미달성(-2), 그리드 완전 채우기(+10)
- **등급:** 총점 기준 S / A / B / C / D 5단계

자세한 메커니즘은 [GAME_DESIGN.md](./GAME_DESIGN.md) 참고.

---

## 기술 스택

| 구분 | 도구 |
|---|---|
| 언어 | JavaScript (ES6+) |
| 프레임워크 | [Phaser 3](https://phaser.io/) (CDN 로드) |
| 빌드 | 없음 (`index.html`이 결과물) |
| 에디터 | VSCode |
| 배포 | itch.io (HTML5 zip 업로드) |

---

## 디렉토리 구조

```
urban-stack/
├── index.html             # 진입점 (Phaser 로드 + 부팅)
├── src/
│   ├── config.js          # 전역 상수 (그리드, 색상, 점수)
│   ├── scenes/            # Phaser 씬 (Boot/Menu/Game/UI)
│   └── objects/           # Grid, Tetromino, CardDeck, ScoreBoard
└── assets/
    ├── images/            # 스프라이트, 배경, UI
    └── sounds/            # 효과음 (freesound.org)
```

문서 파일:
- [CLAUDE.md](./CLAUDE.md) — 개발 지침 (코딩 규칙, 커밋/PR 규칙)
- [GAME_DESIGN.md](./GAME_DESIGN.md) — 게임 기획서
- [PLAN.md](./PLAN.md) — 4주 개발 플랜
- [ASSETS.md](./ASSETS.md) — 필요 에셋 목록

---

## 실행 방법

빌드 도구가 없으므로 `index.html`을 브라우저로 열면 바로 실행됩니다.

```bash
# 로컬 파일을 직접 열기
start index.html       # Windows
open index.html        # macOS

# 또는 간이 정적 서버 사용 (CORS 이슈 회피)
python -m http.server 8000
# → http://localhost:8000
```

---

## 개발 로드맵

| 주차 | 목표 | 완료 기준 |
|---|---|---|
| Week 1 | 코어 로직 구현 | 브라우저에서 블록 배치 가능 |
| Week 2 | 라운드 시스템 완성 | 4라운드 플레이 가능 |
| Week 3 | 폴리싱 (비주얼/사운드) | 처음 보는 사람이 설명 없이 플레이 가능 |
| Week 4 | itch.io 출시 | HTML5 빌드 업로드 완료 |

세부 일정은 [PLAN.md](./PLAN.md) 참고.

---

## 기여 및 개발 규칙

이 프로젝트의 코딩 규칙, 커밋·PR 규칙은 [CLAUDE.md](./CLAUDE.md)에 정리되어 있습니다.
요약하면:

- 함수/파일은 단일 책임 원칙, 작은 단위로 분리
- 커밋은 작은 단위로, 메시지 제목은 명령형
- `main` 직푸시 금지 — 모든 변경은 PR을 거쳐 머지
- 커밋 전 빌드/테스트 검증 (브라우저 콘솔 에러 체크 + 변경 기능 동작 확인)

---

## 라이선스 / 배포

- **배포처:** [itch.io](https://itch.io/) (출시 후 링크 추가 예정)
- **가격:** Free — Pay What You Want
- **태그:** puzzle, casual, tetris, solitaire, board-game, city-builder

원작 FITS 보드게임의 메커니즘만 차용했으며, 테마·비주얼·네이밍은 모두 오리지널입니다. 게임 규칙 자체는 저작권 보호 대상이 아닙니다.
