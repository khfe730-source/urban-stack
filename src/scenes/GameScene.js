// GameScene.js — Week 1 게임 루프
// 흐름: 덱에서 카드 뽑기 → 사용자가 ←→로 열 이동 → Space로 중력 낙하 배치 → 다음 카드
// 라운드/점수 시스템은 Week 2에 추가 예정.

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.drawHeader();

        this.grid = new Grid();
        this.grid.drawBackground(this);

        this.deck = new CardDeck();
        this.deck.shuffle();

        this.currentTetromino = null;
        this.currentCol = 0;
        this.gameOver = false;

        this.createSideUi();
        this.spawnNextTetromino();

        this.input.keyboard.on('keydown', this.handleKey, this);
    }

    // ===== 정적 UI 구성 =====

    drawHeader() {
        this.add.text(
            CONFIG.GAME_WIDTH / 2,
            40,
            'URBAN STACK',
            { fontFamily: CONFIG.FONT_FAMILY, fontSize: '32px', color: CONFIG.TEXT_COLOR, fontStyle: 'bold' }
        ).setOrigin(0.5);

        this.add.text(
            CONFIG.GAME_WIDTH / 2,
            80,
            'Week 1 — Game Loop',
            { fontFamily: CONFIG.FONT_FAMILY, fontSize: '14px', color: CONFIG.TEXT_COLOR_DIM }
        ).setOrigin(0.5);
    }

    // NEXT 라벨 / 덱 카운터 / 게임오버 텍스트 자리
    createSideUi() {
        const sideX = CONFIG.GRID_OFFSET_X / 2;

        this.add.text(sideX, CONFIG.GRID_OFFSET_Y - 20, 'NEXT', {
            fontFamily: CONFIG.FONT_FAMILY, fontSize: '18px', color: CONFIG.TEXT_COLOR_DIM
        }).setOrigin(0.5, 1);

        this.deckCounterText = this.add.text(
            sideX,
            CONFIG.GRID_OFFSET_Y + 200,
            '',
            { fontFamily: CONFIG.FONT_FAMILY, fontSize: '16px', color: CONFIG.TEXT_COLOR }
        ).setOrigin(0.5);

        this.gameOverText = null;
    }

    // ===== 카드 흐름 =====

    spawnNextTetromino() {
        this.clearCurrentSprites();

        const type = this.deck.draw();
        if (type === null) {
            this.handleDeckExhausted();
            return;
        }

        this.currentTetromino = new Tetromino(type);
        this.currentCol = 0;
        this.clampCurrentColToBounds();
        this.currentTetromino.render(this, this.currentCol, 0);

        this.renderNextPreview();
        this.updateDeckCounter();

        // 새 블록을 0행에 놓을 자리조차 없으면 게임 오버
        if (!this.grid.canPlaceAt(this.currentTetromino, this.currentCol, 0)) {
            this.handleGridFull();
        }
    }

    renderNextPreview() {
        if (this.nextPreview) this.nextPreview.clearSprites();
        const nextType = this.deck.peek();
        if (nextType === null) {
            this.nextPreview = null;
            return;
        }
        this.nextPreview = new Tetromino(nextType);
        const sideX = CONFIG.GRID_OFFSET_X / 2;
        const sideY = CONFIG.GRID_OFFSET_Y + 80;
        this.nextPreview.renderPreview(this, sideX, sideY, 0.6);
    }

    updateDeckCounter() {
        this.deckCounterText.setText(`DECK: ${this.deck.size}`);
    }

    // ===== 입력 =====

    handleKey(event) {
        if (this.gameOver) {
            if (event.key === 'r' || event.key === 'R') this.restart();
            return;
        }

        switch (event.key) {
            case 'ArrowLeft': this.moveCurrent(-1); break;
            case 'ArrowRight': this.moveCurrent(1); break;
            case ' ':
            case 'Spacebar': this.dropAndPlace(); break;
            case 'r':
            case 'R': this.restart(); break;
        }
    }

    moveCurrent(delta) {
        this.currentCol += delta;
        this.clampCurrentColToBounds();
        this.redrawCurrent();
    }

    clampCurrentColToBounds() {
        const maxCol = CONFIG.GRID_COLS - this.currentTetromino.width;
        if (this.currentCol < 0) this.currentCol = 0;
        if (this.currentCol > maxCol) this.currentCol = maxCol;
    }

    redrawCurrent() {
        this.currentTetromino.clearSprites();
        this.currentTetromino.render(this, this.currentCol, 0);
    }

    dropAndPlace() {
        const landing = this.grid.findLandingRow(this.currentTetromino, this.currentCol);
        if (landing === -1) return; // 현재 열에 자리 없음 — 다른 열로 이동해야 함

        this.grid.place(this.currentTetromino, this.currentCol, landing);
        this.clearCurrentSprites();
        this.grid.drawPlacedBlocks(this);
        this.spawnNextTetromino();
    }

    // ===== 종료 처리 =====

    handleDeckExhausted() {
        this.showGameOver('덱 소진!\n[R] 다시 시작');
    }

    handleGridFull() {
        this.showGameOver('그리드가 가득 찼습니다\n[R] 다시 시작');
    }

    showGameOver(message) {
        this.gameOver = true;
        this.clearCurrentSprites();
        if (this.nextPreview) this.nextPreview.clearSprites();

        const { GAME_WIDTH, GAME_HEIGHT } = CONFIG;
        this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.6);
        this.gameOverText = this.add.text(
            GAME_WIDTH / 2,
            GAME_HEIGHT / 2,
            message,
            {
                fontFamily: CONFIG.FONT_FAMILY,
                fontSize: '28px',
                color: CONFIG.TEXT_COLOR,
                align: 'center',
                fontStyle: 'bold'
            }
        ).setOrigin(0.5);
    }

    restart() {
        this.scene.restart();
    }

    // ===== 공용 정리 =====

    clearCurrentSprites() {
        if (this.currentTetromino) {
            this.currentTetromino.clearSprites();
            this.currentTetromino = null;
        }
    }
}
