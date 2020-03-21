module.exports = class Card {

    constructor(rank, suit) {
        this.rank = rank;
        this.suit = suit;
    }

    toString() {
        return this.rank + this.suit;
    }

}