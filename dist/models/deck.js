"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const card_1 = require("./card");
const constants_1 = require("./constants");
class Deck {
    constructor() {
        this.deck = [];
    }
    shuffleArray(array) {
        console.log("In the shuffle function");
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }
    clearGenerate() {
        this.deck = [];
        console.log("In the generate function");
        for (const i of constants_1.Constants.Ranks) {
            for (const j of constants_1.Constants.Suits) {
                this.deck.push(new card_1.Card(i, j));
            }
        }
        console.log("going into the shuffle");
        this.shuffleArray(this.deck);
    }
    getCard() {
        return this.deck.pop();
    }
}
exports.Deck = Deck;
//# sourceMappingURL=deck.js.map