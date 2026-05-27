// config.js — Urban Stack 전역 상수 정의
// 모든 매직 넘버는 이 파일에 모아둔다. (CLAUDE.md 규칙)

const CONFIG = {
    // ===== 캔버스 / 화면 =====
    GAME_WIDTH: 720,
    GAME_HEIGHT: 960,
    BG_COLOR: '#1a1a2e',

    // ===== 그리드 =====
    GRID_COLS: 5,
    GRID_ROWS: 9,
    CELL_SIZE: 64,           // 셀 한 변의 픽셀 크기
    GRID_OFFSET_X: 240,      // 그리드 좌측 상단 X (NEXT 영역 옆)
    GRID_OFFSET_Y: 160,      // 그리드 좌측 상단 Y (헤더 아래)
    GRID_EMPTY_COLOR: 0x2d2d44,
    GRID_LINE_COLOR: 0x3d3d5c,
    GRID_LINE_WIDTH: 2,

    // ===== 블록 색상 (테트로미노 종류별) =====
    BLOCK_COLORS: {
        I: 0x00b4d8,  // 하늘색
        O: 0xf77f00,  // 주황
        T: 0x9b5de5,  // 보라
        S: 0x06d6a0,  // 민트
        Z: 0xef233c,  // 빨강
        L: 0xffd166,  // 노랑
        J: 0x118ab2   // 파랑
    },

    // ===== 점수판 칸 색상 =====
    BONUS_COLOR: 0xffd700,   // 보너스 칸 (금색)
    PENALTY_COLOR: 0xff4444, // 페널티 칸 (빨강)

    // ===== 점수 규칙 =====
    SCORE: {
        BONUS_COVERED: 2,        // 보너스 칸 덮기
        NORMAL_COVERED: 1,       // 일반 칸 채우기
        EMPTY_PENALTY: -1,       // 라운드 종료 시 빈 칸
        BONUS_MISSED: -2,        // 보너스 칸 미달성
        GRID_COMPLETE_BONUS: 10  // 그리드 완전 채우기
    },

    // ===== 라운드 =====
    TOTAL_ROUNDS: 4,
    CARDS_PER_TYPE: 2,       // 덱에 각 테트로미노 몇 장씩 넣을지

    // ===== 애니메이션 (밀리초) =====
    ANIM: {
        BLOCK_SLIDE: 150,    // 블록 슬라이딩
        BLOCK_PLACE_PULSE: 120,
        ROUND_FADE: 400,
        SCORE_POPUP: 800
    },

    // ===== 등급 컷오프 =====
    GRADES: [
        { min: 80, label: 'S — 마스터 플래너' },
        { min: 60, label: 'A — 수석 건축가' },
        { min: 40, label: 'B — 도시 설계사' },
        { min: 20, label: 'C — 견습 개발자' },
        { min: -Infinity, label: 'D — 재개발 필요' }
    ],

    // ===== 폰트 =====
    FONT_FAMILY: 'Arial, sans-serif',
    TEXT_COLOR: '#ffffff',
    TEXT_COLOR_DIM: '#a0a0c0'
};

// 그리드 픽셀 크기 (파생 상수)
CONFIG.GRID_PIXEL_WIDTH = CONFIG.GRID_COLS * CONFIG.CELL_SIZE;
CONFIG.GRID_PIXEL_HEIGHT = CONFIG.GRID_ROWS * CONFIG.CELL_SIZE;

// 셀 (col, row) → 픽셀 좌표 (셀 좌측 상단 기준)
CONFIG.cellToPixel = function (col, row) {
    return {
        x: CONFIG.GRID_OFFSET_X + col * CONFIG.CELL_SIZE,
        y: CONFIG.GRID_OFFSET_Y + row * CONFIG.CELL_SIZE
    };
};
