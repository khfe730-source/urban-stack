// Tetromino.js — 7종 테트로미노 정의, 회전/뒤집기, 렌더링
// 좌표는 [col, row] 상대 좌표. (0, 0) = 블록의 좌측 상단 칸.
// 회전(90° CW)과 가로 뒤집기 지원 — 원작 FITS와의 차이점.

class Tetromino {
    // ===== 형태 정의 =====
    // GAME_DESIGN.md의 도형과 일치
    static SHAPES = {
        I: [[0, 0], [1, 0], [2, 0], [3, 0]],            // □□□□
        O: [[0, 0], [1, 0], [0, 1], [1, 1]],            // 2×2
        T: [[0, 0], [1, 0], [2, 0], [1, 1]],            // ▼ 모양
        S: [[1, 0], [2, 0], [0, 1], [1, 1]],            //  □□ / □□
        Z: [[0, 0], [1, 0], [1, 1], [2, 1]],            // □□ /  □□
        L: [[0, 0], [0, 1], [0, 2], [1, 2]],            // 세로 + 우하단
        J: [[1, 0], [1, 1], [0, 2], [1, 2]]             // 세로 + 좌하단
    };

    static TYPES = ['I', 'O', 'T', 'S', 'Z', 'L', 'J'];

    constructor(type) {
        if (!Tetromino.SHAPES[type]) {
            throw new Error(`Unknown tetromino type: ${type}`);
        }
        this.type = type;
        this.cells = Tetromino.SHAPES[type].map(([c, r]) => [c, r]); // 깊은 복사
        this.color = CONFIG.BLOCK_COLORS[type];

        // 렌더링 시 사용할 Phaser 그래픽 오브젝트들 (배치 후엔 그리드가 소유)
        this.sprites = [];
    }

    // 바운딩 박스 너비 (가장 큰 col + 1)
    get width() {
        return Math.max(...this.cells.map(([c]) => c)) + 1;
    }

    // 바운딩 박스 높이 (가장 큰 row + 1)
    get height() {
        return Math.max(...this.cells.map(([_, r]) => r)) + 1;
    }

    // 절대 그리드 좌표 반환: 블록의 (originCol, originRow)에 배치했을 때 차지하는 칸들
    occupiedCells(originCol, originRow) {
        return this.cells.map(([c, r]) => [originCol + c, originRow + r]);
    }

    // ===== 변환 (회전 / 뒤집기) =====

    // 90° 시계방향 회전. cells in-place 변환.
    // 공식: [c, r] → [h-1-r, c] (h = 변환 전 높이)
    rotate() {
        const h = this.height;
        this.cells = this.cells.map(([c, r]) => [h - 1 - r, c]);
        this.normalizeOrigin();
        return this;
    }

    // 가로 뒤집기 (좌우 미러). cells in-place 변환.
    // 공식: [c, r] → [w-1-c, r] (w = 변환 전 너비)
    flip() {
        const w = this.width;
        this.cells = this.cells.map(([c, r]) => [w - 1 - c, r]);
        this.normalizeOrigin();
        return this;
    }

    // 변환 후 좌측 상단을 (0, 0)에 맞춰 정규화 (음수 좌표 방지 + 일관성)
    normalizeOrigin() {
        const minC = Math.min(...this.cells.map(([c]) => c));
        const minR = Math.min(...this.cells.map(([, r]) => r));
        if (minC === 0 && minR === 0) return;
        this.cells = this.cells.map(([c, r]) => [c - minC, r - minR]);
    }

    // Phaser 씬에 픽셀 좌표로 렌더링. (originCol, originRow)는 그리드 셀 좌표.
    // 반환값: 생성된 Phaser.GameObjects.Rectangle 배열
    render(scene, originCol, originRow) {
        this.clearSprites();
        const cell = CONFIG.CELL_SIZE;
        const inset = 2; // 셀 사이 여백

        for (const [c, r] of this.cells) {
            const { x, y } = CONFIG.cellToPixel(originCol + c, originRow + r);
            const rect = scene.add.rectangle(
                x + cell / 2,
                y + cell / 2,
                cell - inset * 2,
                cell - inset * 2,
                this.color
            );
            rect.setStrokeStyle(2, 0xffffff, 0.25);
            this.sprites.push(rect);
        }
        return this.sprites;
    }

    // 미리보기(NEXT 영역) 렌더링 — 임의 픽셀 위치에 그림
    renderPreview(scene, centerX, centerY, scale = 0.6) {
        this.clearSprites();
        const cell = CONFIG.CELL_SIZE * scale;
        const inset = 2;

        // 바운딩 박스 중심을 (centerX, centerY)에 맞춤
        const offsetX = centerX - (this.width * cell) / 2;
        const offsetY = centerY - (this.height * cell) / 2;

        for (const [c, r] of this.cells) {
            const rect = scene.add.rectangle(
                offsetX + c * cell + cell / 2,
                offsetY + r * cell + cell / 2,
                cell - inset * 2,
                cell - inset * 2,
                this.color
            );
            rect.setStrokeStyle(2, 0xffffff, 0.25);
            this.sprites.push(rect);
        }
        return this.sprites;
    }

    // 렌더된 스프라이트 제거
    clearSprites() {
        for (const s of this.sprites) {
            s.destroy();
        }
        this.sprites = [];
    }
}
