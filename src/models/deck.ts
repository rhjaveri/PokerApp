import {Card} from './card';
import {Constants} from './constants';

export class Deck {
    deck: Card[];

    constructor() {
        this.deck = [];
    }

    shuffleArray(array: Card[]) : void {
        console.log("In the shuffle function");
        for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
        }
    }


    clearGenerate() : void {
        this.deck = [];
        console.log("In the generate function");
        for (const i of Constants.Ranks) {
            for (const j of Constants.Suits) {
                this.deck.push(new Card(i, j));
            }
        }
        console.log("going into the shuffle");
        this.shuffleArray(this.deck);
    }

    getCard() : Card {
        return this.deck.pop();
    }
}

