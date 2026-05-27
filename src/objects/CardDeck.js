// CardDeck.js — 테트로미노 카드 덱 생성 / 셔플 / 뽑기
// 한 덱 = 7종 × CARDS_PER_TYPE 장. 뽑기 순서는 셔플 후 결정.

class CardDeck {
    // cardsPerType: 각 테트로미노 종류당 카드 매수 (기본값은 CONFIG.CARDS_PER_TYPE)
    // rng: 0~1 난수 함수 (테스트용으로 주입 가능). 기본 Math.random
    constructor(cardsPerType = CONFIG.CARDS_PER_TYPE, rng = Math.random) {
        this.cardsPerType = cardsPerType;
        this.rng = rng;
        this.cards = CardDeck.buildOrderedDeck(cardsPerType);
    }

    // 7종 × N장 — 셔플 전의 정렬 덱
    static buildOrderedDeck(cardsPerType) {
        const cards = [];
        for (const type of Tetromino.TYPES) {
            for (let i = 0; i < cardsPerType; i++) {
                cards.push(type);
            }
        }
        return cards;
    }

    // Fisher-Yates 셔플 — 현재 카드 배열을 in-place로 섞음
    shuffle() {
        const cards = this.cards;
        for (let i = cards.length - 1; i > 0; i--) {
            const j = Math.floor(this.rng() * (i + 1));
            [cards[i], cards[j]] = [cards[j], cards[i]];
        }
        return this;
    }

    // 다음 카드를 뽑아 반환 (덱에서 제거). 비어있으면 null.
    draw() {
        if (this.isEmpty) return null;
        return this.cards.shift();
    }

    // 다음 카드 미리보기 (뽑지 않음) — NEXT 영역 표시용. 비어있으면 null.
    peek() {
        if (this.isEmpty) return null;
        return this.cards[0];
    }

    // 두 번째 카드도 미리보기 (선택 사항: NEXT 2장 표시할 때 사용)
    peekAt(index) {
        if (index < 0 || index >= this.cards.length) return null;
        return this.cards[index];
    }

    // 덱을 처음 상태(정렬된 7종×N)로 리셋. 셔플은 별도 호출.
    reset() {
        this.cards = CardDeck.buildOrderedDeck(this.cardsPerType);
        return this;
    }

    get size() {
        return this.cards.length;
    }

    get isEmpty() {
        return this.cards.length === 0;
    }

    // 현재 남은 카드들을 종류별로 카운트 (디버그/표시용)
    countByType() {
        const counts = {};
        for (const type of Tetromino.TYPES) counts[type] = 0;
        for (const c of this.cards) counts[c]++;
        return counts;
    }
}
