// Tetromino.js — 7종 테트로미노 정의 및 렌더링
// 좌표는 [col, row] 상대 좌표. (0, 0) = 블록의 좌측 상단 칸.
// 회전은 사용하지 않음 (FITS 룰에 따라 고정된 형태 유지).

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
