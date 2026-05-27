# CLAUDE.md — Urban Stack 개발 지침

## 프로젝트 개요
- **게임명:** Urban Stack
- **장르:** 퍼즐 / 캐주얼 (솔로 보드게임 디지털화)
- **원작 참고:** FITS 보드게임 메커니즘 (테마/비주얼은 오리지널)
- **출시 플랫폼:** itch.io (HTML5 웹 빌드)
- **목표 출시:** 기획 시작 후 4주 이내

## 기술 스택
- **언어:** JavaScript (ES6+)
- **프레임워크:** Phaser.js 3 (CDN)
- **에디터:** VSCode
- **빌드 도구:** 없음 (index.html이 결과물)
- **배포:** index.html + assets/ 폴더를 zip으로 itch.io 업로드

## 디렉토리 구조
```
urban-stack/
├── CLAUDE.md              ← 이 파일 (작업 지침)
├── GAME_DESIGN.md         ← 게임 기획서
├── PLAN.md                ← 4주 개발 플랜
├── index.html             ← 진입점 (Phaser 로드 포함)
├── src/
│   ├── config.js          ← Phaser 설정, 상수 정의
│   ├── scenes/
│   │   ├── BootScene.js   ← 에셋 로딩
│   │   ├── MenuScene.js   ← 타이틀 화면
│   │   ├── GameScene.js   ← 핵심 게임 로직
│   │   └── UIScene.js     ← 점수/라운드 UI 오버레이
│   └── objects/
│       ├── Grid.js        ← 5×9 그리드 관리
│       ├── Tetromino.js   ← 테트로미노 7종 정의 및 렌더링
│       ├── CardDeck.js    ← 카드 덱 셔플/뽑기
│       └── ScoreBoard.js  ← 라운드별 점수판 오버레이
└── assets/
    ├── images/            ← 스프라이트, 배경, UI 이미지
    └── sounds/            ← 효과음 (freesound.org 소스)
```

## 코딩 규칙
- 모든 씬은 `Phaser.Scene`을 extends하여 구현
- 상수(그리드 크기, 색상 등)는 반드시 `config.js`에 정의
- 각 파일은 단일 책임 원칙 (한 파일 = 한 클래스/역할)
- 주석은 한국어로 작성
- 함수명/변수명은 영어 camelCase

## 작업 우선순위
1. Grid.js + Tetromino.js (코어 로직)
2. GameScene.js (게임 루프)
3. ScoreBoard.js (라운드 시스템)
4. UIScene.js (점수 UI)
5. MenuScene.js (타이틀)
6. 폴리싱 (애니메이션, 사운드, 비주얼)

## 주의사항
- HTML5 빌드 최적화: 총 용량 50MB 이하 유지
- 모바일 터치 지원 고려 (itch.io 모바일 접속자 많음)
- 외부 폰트는 Google Fonts CDN 사용 가능
- Phaser 버전: 3.x (CDN: https://cdn.jsdelivr.net/npm/phaser@3/dist/phaser.min.js)
