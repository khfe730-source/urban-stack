# ASSETS.md — 필요 에셋 목록

Claude Code가 코드 작업 중 필요한 에셋을 파악할 수 있도록 정리한 파일.
에셋은 직접 제작하거나 무료 소스에서 가져올 것.

---

## 이미지 에셋 (`assets/images/`)

### 필수
| 파일명 | 크기 | 설명 | 우선순위 |
|---|---|---|---|
| `block_tileset.png` | 32×32px × 7 | 테트로미노 블록 스프라이트 (색상별) | 🔴 필수 |
| `grid_bg.png` | 160×288px | 그리드 배경 (5×9, 32px 셀) | 🔴 필수 |
| `scoreboard_1~4.png` | 160×288px | 라운드별 점수판 오버레이 4종 | 🔴 필수 |
| `ui_panel.png` | 가변 | NEXT 블록 패널, 점수 패널 | 🟡 권장 |
| `bg_city.png` | 960×540px | 도시 스카이라인 배경 | 🟡 권장 |
| `logo.png` | 400×100px | Urban Stack 타이틀 로고 | 🟡 권장 |

### 선택
| 파일명 | 크기 | 설명 |
|---|---|---|
| `icon_bonus.png` | 16×16px | 점수판 보너스 칸 아이콘 |
| `icon_penalty.png` | 16×16px | 점수판 페널티 칸 아이콘 |
| `btn_start.png` | 200×60px | 시작 버튼 |
| `btn_again.png` | 200×60px | 다시하기 버튼 |
| `grade_s~d.png` | 100×100px | 등급 뱃지 (S/A/B/C/D) |

### itch.io 페이지용 (게임 외부)
| 파일명 | 크기 | 설명 |
|---|---|---|
| `cover.png` | 630×500px | itch.io 커버 이미지 |
| `screenshot_1~5.png` | 1280×720px | 스크린샷 |
| `gameplay.gif` | 가변 | 플레이 GIF (선택) |

---

## 사운드 에셋 (`assets/sounds/`)
freesound.org에서 CC0 라이선스로 구하거나 직접 제작

| 파일명 | 설명 | 추천 검색어 |
|---|---|---|
| `place.wav` | 블록 배치음 | "block place", "tile click" |
| `bonus.wav` | 보너스 칸 달성음 | "coin", "ding", "success" |
| `penalty.wav` | 페널티 발생음 | "error", "buzz" |
| `round_end.wav` | 라운드 종료음 | "fanfare short", "level complete" |
| `game_over.wav` | 게임 종료음 | "game over", "end jingle" |
| `bgm.mp3` | 배경음악 (루프) | "casual bgm loop", "puzzle music" |

---

## 폰트
Google Fonts CDN으로 로드 (설치 불필요)

| 용도 | 폰트 | 링크 |
|---|---|---|
| 타이틀 | Rajdhani Bold | fonts.google.com |
| 점수/숫자 | Orbitron | fonts.google.com |
| 일반 UI | Inter | fonts.google.com |

---

## 에셋 제작 우선순위
1. `block_tileset.png` — 없으면 게임 자체가 안 보임
2. `scoreboard_1~4.png` — 라운드 시스템 핵심
3. `grid_bg.png` — 그리드 배경
4. 사운드 — 폴리싱 단계에서 추가
5. itch.io 페이지용 에셋 — Week 4에 제작

## 임시 대체 방법 (개발 중)
에셋이 없을 때 Phaser Graphics API로 임시 대체 가능:
- 블록: 색상 채운 사각형 + 테두리
- 배경: 단색 fill
- 버튼: Graphics로 직접 그리기
→ **Week 1~2는 임시 그래픽으로 진행하고, Week 3에 실제 에셋으로 교체**
