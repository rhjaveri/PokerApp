var Player = require("./player");
var Deck = require("./deck")
var Hand = require('pokersolver').Hand;

module.exports = class Game {

    constructor(adminPlayer) {
        this.isStarted = false;
        this.pot = 0;
        this.indexBlind = 0;
        this.indexTurn = 0;
        this.deck = new Deck();
        this.players [adminPlayer];

        this.deck.generate();

    }

    // A reques to 
    startGameRequest(token) {

    }

    // adds a player object to the game
    addPlayer(newPlayer) {
        this.players.push(newPlayer);
    }

    // shuffles a new deck
    newDeck() {
        this.deck = this.deck.generate();
    }

    
    // Add field for the pot;
    // add index of the blind and the person's turn here instead of in the game

    // randomBlind in the beginning
    // set the turn function
}