var Hand = require('pokersolver').Hand;
module.exports = class Player {


    // each player is initialized with being the admin or not
    // and the number of chips they are starting out with
    constructor(isAdmin, chips, tokenID) {
        this.tokenID = tokenID;
        this.isAdmin = isAdmin;
        this.hand = [];
        this.handValue = Hand.solve(this.hand);
        this.chips = chips;
        this.inHand = true;
    }

    validateUser(token) {
        return this.tokenID == token;
    }

    // folds a player (out of hand)
    fold() {
        this.inHand = false;
        
    }

    // new hand the player is back in the hand
    newHandPlayer() {
        this.inHand = true;
    }
    // does the player have the necessary chips to make bet
    hasEnoughChips(betChips) {
        return this.chips > betChips;
    }
    
    // adds the number of chips the user has
    addChips(chips) {
        this.chips += chips;
    }

    // TODO make it so it takes the inputs of the cards
    updateHandValue() {
        this.handValue = Hand.solve(this.hand);
    }
}
