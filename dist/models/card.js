"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
class Card {
    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }
    toString() {
        return "" + this.rank + this.suit;
    }
}
exports.Card = Card;
//# sourceMappingURL=card.js.map