// Grid.js — 5×9 그리드 상태 관리 및 렌더링
// 셀 값: null (빈 칸) 또는 테트로미노 타입 문자열 ('I', 'O', 'T', 'S', 'Z', 'L', 'J')

class Grid {
    constructor() {
        this.cols = CONFIG.GRID_COLS;
        this.rows = CONFIG.GRID_ROWS;
        this.cells = Grid.createEmptyCells(this.cols, this.rows);

        // 렌더링 캐시 — 배경 셀과 배치된 블록 스프라이트를 분리 관리
        this.cellSprites = [];
        this.blockSprites = new Map(); // key: "col,row" → Phaser Rectangle
    }

    // ===== 상태 초기화 =====

    static createEmptyCells(cols, rows) {
        const arr = [];
        for (let r = 0; r < rows; r++) {
            arr.push(new Array(cols).fill(null));
        }
        return arr;
    }

    reset() {
        this.cells = Grid.createEmptyCells(this.cols, this.rows);
        this.clearBlockSprites();
    }

    // ===== 좌표 / 셀 조회 =====

    isInBounds(col, row) {
        return col >= 0 && col < this.cols && row >= 0 && row < this.rows;
    }

    isEmpty(col, row) {
        if (!this.isInBounds(col, row)) return false;
        return this.cells[row][col] === null;
    }

    cellAt(col, row) {
        if (!this.isInBounds(col, row)) return undefined;
        return this.cells[row][col];
    }

    // ===== 배치 로직 =====

    // 테트로미노를 (originCol, originRow)에 놓을 수 있는지 검사
    canPlaceAt(tetromino, originCol, originRow) {
        for (const [c, r] of tetromino.occupiedCells(originCol, originRow)) {
            if (!this.isEmpty(c, r)) return false;
        }
        return true;
    }

    // 중력 낙하: 주어진 열에서 테트로미노가 정착할 최저 originRow 반환
    // 배치 자체가 불가능하면 -1
    findLandingRow(tetromino, originCol) {
        if (!this.canPlaceAt(tetromino, originCol, 0)) return -1;
        let landing = 0;
        while (this.canPlaceAt(tetromino, originCol, landing + 1)) {
            landing++;
        }
        return landing;
    }

    // 셀 상태에 배치 확정. 성공 시 true.
    place(tetromino, originCol, originRow) {
        if (!this.canPlaceAt(tetromino, originCol, originRow)) {
            return false;
        }
        for (const [c, r] of tetromino.occupiedCells(originCol, originRow)) {
            this.cells[r][c] = tetromino.type;
        }
        return true;
    }

    // ===== 점수 계산 헬퍼 =====

    countEmpty() {
        let n = 0;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                if (this.cells[r][c] === null) n++;
            }
        }
        return n;
    }

    countFilled() {
        return this.cols * this.rows - this.countEmpty();
    }

    isFull() {
        return this.countEmpty() === 0;
    }

    // ===== 렌더링 =====

    // 빈 셀 배경 — 한 번만 호출 (라운드 시작 시)
    drawBackground(scene) {
        this.clearCellSprites();
        const cell = CONFIG.CELL_SIZE;
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                this.cellSprites.push(this.drawCellBackground(scene, c, r, cell));
            }
        }
    }

    drawCellBackground(scene, col, row, cell) {
        const { x, y } = CONFIG.cellToPixel(col, row);
        const rect = scene.add.rectangle(
            x + cell / 2,
            y + cell / 2,
            cell,
            cell,
            CONFIG.GRID_EMPTY_COLOR
        );
        rect.setStrokeStyle(CONFIG.GRID_LINE_WIDTH, CONFIG.GRID_LINE_COLOR);
        return rect;
    }

    // 현재 상태의 배치된 블록을 모두 다시 그림
    drawPlacedBlocks(scene) {
        this.clearBlockSprites();
        for (let r = 0; r < this.rows; r++) {
            for (let c = 0; c < this.cols; c++) {
                const type = this.cells[r][c];
                if (type === null) continue;
                this.drawBlockCell(scene, c, r, type);
            }
        }
    }

    drawBlockCell(scene, col, row, type) {
        const cell = CONFIG.CELL_SIZE;
        const inset = 2;
        const { x, y } = CONFIG.cellToPixel(col, row);
        const rect = scene.add.rectangle(
            x + cell / 2,
            y + cell / 2,
            cell - inset * 2,
            cell - inset * 2,
            CONFIG.BLOCK_COLORS[type]
        );
        rect.setStrokeStyle(2, 0xffffff, 0.25);
        this.blockSprites.set(`${col},${row}`, rect);
        return rect;
    }

    clearCellSprites() {
        for (const s of this.cellSprites) s.destroy();
        this.cellSprites = [];
    }

    clearBlockSprites() {
        for (const s of this.blockSprites.values()) s.destroy();
        this.blockSprites.clear();
    }
}
