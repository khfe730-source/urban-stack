// ScoreBoard.js — 라운드별 점수판 (보너스 칸 레이아웃 + 점수 계산 + 오버레이 렌더링)
//
// 각 라운드마다 5×9 그리드 위에 어떤 칸이 보너스인지 정의한다.
// 보너스 칸 좌표는 [col, row] 형식 (Grid/Tetromino와 동일).
//
// 점수 규칙 (CONFIG.SCORE 참고):
//   보너스 + 덮음 → +2, 보너스 + 빈칸 → -2
//   일반   + 덮음 → +1, 일반   + 빈칸 → -1
//   그리드 완전 채우기 → +10 보너스

class ScoreBoard {
    // 4개 라운드 점수판 — 점차 어려워지는 패턴
    static LAYOUTS = [
        // Round 1 (보너스 5칸): 4모서리 + 중앙 — 가장 쉬움
        [[0, 0], [4, 0], [2, 4], [0, 8], [4, 8]],

        // Round 2 (보너스 7칸): 가운데 세로줄 + 가로 양끝
        [[2, 0], [2, 2], [0, 4], [2, 4], [4, 4], [2, 6], [2, 8]],

        // Round 3 (보너스 9칸): 지그재그
        [[0, 1], [2, 1], [4, 1], [1, 3], [3, 3], [0, 5], [2, 5], [4, 5], [2, 7]],

        // Round 4 (보너스 12칸): 격자형 — 가장 어려움
        [[0, 0], [2, 0], [4, 0], [1, 2], [3, 2], [0, 4], [2, 4], [4, 4], [1, 6], [3, 6], [0, 8], [4, 8]]
    ];

    static get TOTAL_ROUNDS() {
        return ScoreBoard.LAYOUTS.length;
    }

    constructor(roundIndex) {
        if (!Number.isInteger(roundIndex) || roundIndex < 0 || roundIndex >= ScoreBoard.LAYOUTS.length) {
            throw new Error(`Invalid round index: ${roundIndex}`);
        }
        this.roundIndex = roundIndex;
        this.bonusCells = new Set(
            ScoreBoard.LAYOUTS[roundIndex].map(([c, r]) => ScoreBoard.cellKey(c, r))
        );
        this.sprites = [];
    }

    static cellKey(col, row) {
        return `${col},${row}`;
    }

    // 보너스 칸 여부
    isBonus(col, row) {
        return this.bonusCells.has(ScoreBoard.cellKey(col, row));
    }

    // 보너스 칸 좌표 목록 ([col, row] 배열) — UI/디버그용
    getBonusCells() {
        return Array.from(this.bonusCells).map(key => key.split(',').map(Number));
    }

    // ===== 점수 계산 =====

    // grid: Grid 인스턴스
    // 반환: { bonusCovered, bonusMissed, normalCovered, normalEmpty, gridComplete, breakdown, total }
    calculateScore(grid) {
        const counts = this.countCells(grid);
        const breakdown = this.buildBreakdown(counts);
        const total = breakdown.reduce((sum, item) => sum + item.score, 0);
        return { ...counts, breakdown, total };
    }

    // 그리드를 훑어 4가지 카테고리로 카운트
    countCells(grid) {
        let bonusCovered = 0;
        let bonusMissed = 0;
        let normalCovered = 0;
        let normalEmpty = 0;

        for (let r = 0; r < grid.rows; r++) {
            for (let c = 0; c < grid.cols; c++) {
                const isBonus = this.isBonus(c, r);
                const isEmpty = grid.isEmpty(c, r);
                if (isBonus && !isEmpty) bonusCovered++;
                else if (isBonus && isEmpty) bonusMissed++;
                else if (!isBonus && !isEmpty) normalCovered++;
                else normalEmpty++;
            }
        }

        const gridComplete = (bonusMissed === 0 && normalEmpty === 0);
        return { bonusCovered, bonusMissed, normalCovered, normalEmpty, gridComplete };
    }

    // 항목별 점수 내역 (UI 결산 화면에서 줄별로 표시 가능)
    buildBreakdown(counts) {
        const { SCORE } = CONFIG;
        const items = [
            { label: '보너스 덮기', count: counts.bonusCovered, unit: SCORE.BONUS_COVERED },
            { label: '일반 덮기', count: counts.normalCovered, unit: SCORE.NORMAL_COVERED },
            { label: '빈 칸', count: counts.normalEmpty, unit: SCORE.EMPTY_PENALTY },
            { label: '보너스 미달성', count: counts.bonusMissed, unit: SCORE.BONUS_MISSED }
        ].map(item => ({ ...item, score: item.count * item.unit }));

        if (counts.gridComplete) {
            items.push({ label: '그리드 완전 채우기', count: 1, unit: SCORE.GRID_COMPLETE_BONUS, score: SCORE.GRID_COMPLETE_BONUS });
        }
        return items;
    }

    // ===== 렌더링 =====

    // 보너스 칸을 그리드 위에 반투명 오버레이로 표시
    render(scene) {
        this.clearSprites();
        const cell = CONFIG.CELL_SIZE;
        for (const [c, r] of this.getBonusCells()) {
            this.sprites.push(this.drawBonusOverlay(scene, c, r, cell));
        }
    }

    drawBonusOverlay(scene, col, row, cell) {
        const { x, y } = CONFIG.cellToPixel(col, row);
        const rect = scene.add.rectangle(
            x + cell / 2,
            y + cell / 2,
            cell - 2,
            cell - 2,
            CONFIG.BONUS_COLOR,
            0.35 // 반투명 — 블록이 위에 올라와도 살짝 비침
        );
        rect.setStrokeStyle(2, CONFIG.BONUS_COLOR, 0.9);
        return rect;
    }

    clearSprites() {
        for (const s of this.sprites) s.destroy();
        this.sprites = [];
    }
}
