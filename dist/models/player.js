"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const pokersolver_1 = __importDefault(require("pokersolver"));
const Hand = pokersolver_1.default.Hand;
class Player {
    // each player is initialized with being the admin or not
    // and the number of chips they are starting out with
    constructor(isAdmin, chips, tokenID) {
        this.tokenID = tokenID;
        this.isAdmin = isAdmin;
        this.hand = [];
        this.twoCard = [];
        // this.handValue = null;
        this.chips = chips;
        this.status = 1;
        this.chipsInHand = 0;
    }
    // sets the initial hand for each player
    setInitialHand(c1, c2) {
        this.hand.push(c1);
        this.hand.push(c2);
        this.twoCard.push(c1);
        this.twoCard.push(c2);
    }
    // add flop to the player's hand
    addFlop(card1, card2, card3) {
        this.hand.push(card1);
        this.hand.push(card2);
        this.hand.push(card3);
    }
    // add card to the players hand
    addCard(card) {
        this.hand.push(card);
    }
    // methods for the number of chips player has in hand
    addChipsInHand(chips) {
        this.chipsInHand += chips;
    }
    setChipsInHand(chips) {
        this.chipsInHand = chips;
    }
    getChipsInHand() {
        return this.chipsInHand;
    }
    // turns the hand into a string for evaluation
    handAsStrings() {
        const result = new Array();
        for (const i of this.hand) {
            result.push(i.toString());
        }
        return result;
    }
    // somehow validate the user taken
    validateUser(token) {
        return this.tokenID === token;
    }
    // status: -1 is fold
    // 0 is checked/ has already made their move 
    // 2 is checked / needs to make move
    // 1 needs to call to stay in / does need to put more to stay in
    // -1 is folded
    // 3 is all in baby 
    // folds a player (out of hand)
    fold() {
        this.status = -1;
    }
    isfold() {
        return this.status === -1;
    }
    // clears the player's deck and the two Card deck
    clearDeck() {
        this.hand = [];
        this.twoCard = [];
    }
    // set status to specified
    setStatus(status) {
        this.status = status;
    }
    // gets the player status
    getStatus() {
        return this.status;
    }
    // does the player have the necessary chips to make bet
    hasEnoughChips(betChips) {
        return this.chips > betChips;
    }
    // adds the number of chips the user has
    addChips(chips) {
        this.chips += chips;
    }
    // takes chips from the player and puts in pot
    payChips(chips) {
        this.chips -= chips;
    }
    // sets the number of chips player has
    setChips(chips) {
        this.chips = 0;
    }
    // gets the number of chips player has left
    getChips() {
        return this.chips;
    }
    // gets the token ID
    getToken() {
        return this.tokenID;
    }
}
exports.Player = Player;
//# sourceMappingURL=player.js.map