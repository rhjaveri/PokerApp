const constants = require('./constants'); 
const Card = require('./card');

module.exports = class Deck {

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

    generate() {
        console.log("In the generate function");
        for (let i = 0; i < constants.Ranks.length; i++) {
            for (let j = 0; j < constants.Suits.length; j++) {
                this.deck.push(new Card(constants.Ranks[i], constants.Suits[j]));
            }
        }
        console.log("going into the shuffle");
        this.shuffleArray(this.deck); 
    }

    getCard() {
        return this.deck.pop();
    }
}

