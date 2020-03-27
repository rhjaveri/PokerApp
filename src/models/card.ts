export class Card {
    rank: string;
    suit: string;

    constructor(rank: string, suit: string) {
        this.rank = rank;
        this.suit = suit;
    }

    toString() : string {
        return "" + this.rank + this.suit;
    }

}