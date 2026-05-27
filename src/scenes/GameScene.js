// GameScene.js — 메인 게임 씬 (Week 2: 4라운드 + 점수 시스템)
//
// 상태(state):
//   'playing'      — 블록 배치 진행 중
//   'roundResult'  — 라운드 결과 모달 표시 (Space로 다음 라운드)
//   'finalResult'  — 최종 결과 (총점 + 등급) (R로 처음부터)
//
// 라운드 종료 조건:
//   - 그리드 가득 참
//   - 덱 소진
//   - 새 카드를 어느 열에도 놓을 수 없음 (현재 형태 기준)

class GameScene extends Phaser.Scene {
    constructor() {
        super({ key: 'GameScene' });
    }

    create() {
        this.totalScore = 0;
        this.roundScores = [];
        this.state = 'playing';

        // 영구적 정적 UI (라운드 간에 유지)
        this.drawHeader();
        this.createSideUi();
        this.input.keyboard.on('keydown', this.handleKey, this);

        this.startRound(0);
    }

    // ===== 헤더 / 사이드 UI =====

    drawHeader() {
        this.add.text(
            CONFIG.GAME_WIDTH / 2, 40, 'URBAN STACK',
            { fontFamily: CONFIG.FONT_FAMILY, fontSize: '32px', color: CONFIG.TEXT_COLOR, fontStyle: 'bold' }
        ).setOrigin(0.5);
    }

    createSideUi() {
        const sideX = CONFIG.GRID_OFFSET_X / 2;
        const dim = { fontFamily: CONFIG.FONT_FAMILY, fontSize: '14px', color: CONFIG.TEXT_COLOR_DIM };
        const big = { fontFamily: CONFIG.FONT_FAMILY, fontSize: '18px', color: CONFIG.TEXT_COLOR, fontStyle: 'bold' };

        this.add.text(sideX, CONFIG.GRID_OFFSET_Y - 100, 'ROUND', dim).setOrigin(0.5);
        this.roundText = this.add.text(sideX, CONFIG.GRID_OFFSET_Y - 80, '', big).setOrigin(0.5);

        this.add.text(sideX, CONFIG.GRID_OFFSET_Y - 50, 'TOTAL', dim).setOrigin(0.5);
        this.totalScoreText = this.add.text(sideX, CONFIG.GRID_OFFSET_Y - 30, '0', big).setOrigin(0.5);

        this.add.text(sideX, CONFIG.GRID_OFFSET_Y + 20, 'NEXT', dim).setOrigin(0.5);
        // NEXT 미리보기는 renderNextPreview에서 동적 생성, 중심: (sideX, GRID_OFFSET_Y + 80)

        this.deckCounterText = this.add.text(
            sideX, CONFIG.GRID_OFFSET_Y + 200, '', dim
        ).setOrigin(0.5);
    }

    updateSideUi() {
        const total = ScoreBoard.TOTAL_ROUNDS;
        this.roundText.setText(`${this.currentRoundIndex + 1} / ${total}`);
        this.totalScoreText.setText(`${this.totalScore}`);
        if (this.deck) this.deckCounterText.setText(`DECK: ${this.deck.size}`);
    }

    // ===== 라운드 진행 =====

    startRound(roundIndex) {
        this.state = 'playing';
        this.currentRoundIndex = roundIndex;

        this.clearModal();
        this.clearCurrentSprites();
        if (this.grid) this.grid.clearBlockSprites();
        if (this.scoreBoard) this.scoreBoard.clearSprites();

        this.grid = new Grid();
        this.grid.drawBackground(this);
        this.scoreBoard = new ScoreBoard(roundIndex);
        this.scoreBoard.render(this);
        this.deck = new CardDeck();
        this.deck.shuffle();

        this.currentTetromino = null;
        this.currentCol = 0;

        this.updateSideUi();
        this.spawnNextTetromino();
    }

    endRound() {
        if (this.state !== 'playing') return;

        const result = this.scoreBoard.calculateScore(this.grid);
        this.roundScores.push(result.total);
        this.totalScore += result.total;

        this.clearCurrentSprites();
        if (this.nextPreview) this.nextPreview.clearSprites();
        this.updateSideUi();

        const isFinalRound = (this.currentRoundIndex === ScoreBoard.TOTAL_ROUNDS - 1);
        if (isFinalRound) {
            this.showFinalResult();
        } else {
            this.showRoundResult(result);
        }
    }

    // ===== 결과 모달 =====

    showRoundResult(result) {
        this.state = 'roundResult';
        const lines = [`ROUND ${this.currentRoundIndex + 1} 완료`, ''];
        for (const item of result.breakdown) {
            const sign = item.score >= 0 ? '+' : '';
            lines.push(`${item.label}: ${item.count} × ${item.unit} = ${sign}${item.score}`);
        }
        lines.push('');
        lines.push(`라운드 점수: ${result.total >= 0 ? '+' : ''}${result.total}`);
        lines.push(`누적 총점: ${this.totalScore}`);
        lines.push('');
        lines.push('[Space] 다음 라운드');
        this.drawModal(lines.join('\n'));
    }

    showFinalResult() {
        this.state = 'finalResult';
        const grade = GameScene.computeGrade(this.totalScore);
        const lines = ['GAME COMPLETE', ''];
        this.roundScores.forEach((s, i) => {
            const sign = s >= 0 ? '+' : '';
            lines.push(`Round ${i + 1}: ${sign}${s}`);
        });
        lines.push('');
        lines.push(`최종 점수: ${this.totalScore}`);
        lines.push(`등급: ${grade}`);
        lines.push('');
        lines.push('[R] 다시 시작');
        this.drawModal(lines.join('\n'));
    }

    static computeGrade(score) {
        for (const tier of CONFIG.GRADES) {
            if (score >= tier.min) return tier.label;
        }
        return CONFIG.GRADES[CONFIG.GRADES.length - 1].label;
    }

    drawModal(text) {
        const { GAME_WIDTH, GAME_HEIGHT } = CONFIG;
        this.modalBg = this.add.rectangle(GAME_WIDTH / 2, GAME_HEIGHT / 2, GAME_WIDTH, GAME_HEIGHT, 0x000000, 0.78);
        this.modalText = this.add.text(GAME_WIDTH / 2, GAME_HEIGHT / 2, text, {
            fontFamily: CONFIG.FONT_FAMILY,
            fontSize: '18px',
            color: CONFIG.TEXT_COLOR,
            align: 'center',
            lineSpacing: 6
        }).setOrigin(0.5);
    }

    clearModal() {
        if (this.modalBg) { this.modalBg.destroy(); this.modalBg = null; }
        if (this.modalText) { this.modalText.destroy(); this.modalText = null; }
    }

    // ===== 카드 흐름 =====

    spawnNextTetromino() {
        this.clearCurrentSprites();

        const type = this.deck.draw();
        if (type === null) {
            this.endRound();
            return;
        }

        this.currentTetromino = new Tetromino(type);
        const col = this.findValidSpawnColumn(this.currentTetromino);
        if (col === -1) {
            this.endRound();
            return;
        }
        this.currentCol = col;
        this.currentTetromino.render(this, this.currentCol, 0);

        this.renderNextPreview();
        this.updateSideUi();
    }

    // 현재 형태로 row 0에 놓을 수 있는 가장 왼쪽 열. 없으면 -1.
    findValidSpawnColumn(tetromino) {
        const maxCol = CONFIG.GRID_COLS - tetromino.width;
        for (let col = 0; col <= maxCol; col++) {
            if (this.grid.canPlaceAt(tetromino, col, 0)) return col;
        }
        return -1;
    }

    renderNextPreview() {
        if (this.nextPreview) this.nextPreview.clearSprites();
        const nextType = this.deck.peek();
        if (nextType === null) { this.nextPreview = null; return; }
        this.nextPreview = new Tetromino(nextType);
        const sideX = CONFIG.GRID_OFFSET_X / 2;
        const sideY = CONFIG.GRID_OFFSET_Y + 90;
        this.nextPreview.renderPreview(this, sideX, sideY, 0.55);
    }

    // ===== 입력 =====

    handleKey(event) {
        if (this.state === 'roundResult') {
            if (event.key === ' ' || event.key === 'Spacebar') {
                this.startRound(this.currentRoundIndex + 1);
            }
            return;
        }
        if (this.state === 'finalResult') {
            if (event.key === 'r' || event.key === 'R') this.restart();
            return;
        }

        // state === 'playing'
        switch (event.key) {
            case 'ArrowLeft': this.moveCurrent(-1); break;
            case 'ArrowRight': this.moveCurrent(1); break;
            case 'ArrowUp':
            case 'x':
            case 'X': this.rotateCurrent(); break;
            case 'f':
            case 'F': this.flipCurrent(); break;
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

    rotateCurrent() {
        this.currentTetromino.rotate();
        this.clampCurrentColToBounds();
        this.redrawCurrent();
    }

    flipCurrent() {
        this.currentTetromino.flip();
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
        if (landing === -1) return; // 현재 열엔 자리 없음 — 다른 열/회전 시도

        this.grid.place(this.currentTetromino, this.currentCol, landing);
        this.clearCurrentSprites();
        this.grid.drawPlacedBlocks(this);

        if (this.grid.isFull()) {
            this.endRound();
            return;
        }

        this.spawnNextTetromino();
    }

    // ===== 공통 정리 / 리스타트 =====

    clearCurrentSprites() {
        if (this.currentTetromino) {
            this.currentTetromino.clearSprites();
            this.currentTetromino = null;
        }
    }

    restart() {
        this.scene.restart();
    }
}
