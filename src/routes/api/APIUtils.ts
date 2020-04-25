import { Player } from "../../models/player";
import {pokerGame} from "../../GameObject";

export class APIUtils {
// constructs the players object to be sent back based on the state of the game

makePlayers(name: any) {
    console.log(name);
    // if it's not the end of a hand
    if (pokerGame.handStatus !== 0) {
    return pokerGame.players.map(p => 
        this.filterPlayer(p, name));
}
// it is the end of a hand
 return pokerGame.players;
};

// filters a players card to only include their own
filterPlayer(player : Player, name: any) {

    // it is not the name of the person who made the call
    if (player.getName() !== name) {
        const { hand, twoCard, ...newPlayer } = player;
        return newPlayer;
    }

    // it is the name of that person
    else {
    return player;
    }
}

// constructs a boolean value to be sent determining if it is the player's turn
makeIsTurn(name: any) {
    if (pokerGame.players[pokerGame.indexTurn].getName() === name) {
        return true;
    }
    return false;
}

// sets the amount for the player to call
makeToCall(name: any) {
    // if the hand not started it should be zero
    if (pokerGame.handStatus === 0) {return 0;}

    // the difference between the MaxBet and the chipsInHand of that specific player
    return pokerGame.maxBet - pokerGame.getPlayerByName(name).getChipsInHand();

}

// Creates the pokerGame object to send to the client
pokerGameClient(name: any) {
    return {
        isAdmin : pokerGame.adminName === name,
        adminName : pokerGame.adminName,
        handStatus: pokerGame.handStatus, 
        gameToken : pokerGame.gameToken,
        buyIn: pokerGame.buyIn,
        isStarted : pokerGame.isStarted,
        pot: pokerGame.pot,
        tableHand: pokerGame.tableHand,
        isTurn: this.makeIsTurn(name),
        players: this.makePlayers(name),
        toCall: this.makeToCall(name)
    }
}

// gets the pokerGame object without any name
pokerGameBoard() {
    return {
        adminName : pokerGame.adminName,
        gameToken : pokerGame.gameToken,
        buyIn: pokerGame.buyIn,
        isStarted : pokerGame.isStarted,
        pot: pokerGame.pot,
        tableHand: pokerGame.tableHand,
        // dont send anything as the string to make players because u should know none of the hands
        players: this.makePlayers(""),
    }
}

}