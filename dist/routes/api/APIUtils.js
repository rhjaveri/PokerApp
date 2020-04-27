"use strict";
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
const GameObject_1 = require("../../GameObject");
class APIUtils {
    // constructs the players object to be sent back based on the state of the game
    makePlayers(name) {
        console.log(name);
        // if it's not the end of a hand
        if (GameObject_1.pokerGame.handStatus !== 0) {
            return GameObject_1.pokerGame.players.map(p => this.filterPlayer(p, name));
        }
        // it is the end of a hand
        return GameObject_1.pokerGame.players;
    }
    ;
    // filters a players card to only include their own
    filterPlayer(player, name) {
        // it is not the name of the person who made the call
        if (player.getName() !== name) {
            const { hand, twoCard } = player, newPlayer = __rest(player, ["hand", "twoCard"]);
            return newPlayer;
        }
        // it is the name of that person
        else {
            return player;
        }
    }
    // constructs a boolean value to be sent determining if it is the player's turn
    makeIsTurn(name) {
        if (GameObject_1.pokerGame.players[GameObject_1.pokerGame.indexTurn].getName() === name) {
            return true;
        }
        return false;
    }
    // sets the amount for the player to call
    makeToCall(name) {
        // if the hand not started it should be zero
        if (GameObject_1.pokerGame.handStatus === 0) {
            return 0;
        }
        // the difference between the MaxBet and the chipsInHand of that specific player
        return GameObject_1.pokerGame.maxBet - GameObject_1.pokerGame.getPlayerByName(name).getChipsInHand();
    }
    // Creates the pokerGame object to send to the client
    pokerGameClient(name) {
        if (GameObject_1.pokerGame.getPlayerByName(name) === null) {
            return {};
        }
        return {
            myChips: GameObject_1.pokerGame.getPlayerByName(name).getChips(),
            playerStatus: GameObject_1.pokerGame.getPlayerByName(name).getStatus(),
            isAdmin: GameObject_1.pokerGame.adminName === name,
            indexTurn: GameObject_1.pokerGame.indexTurn,
            adminName: GameObject_1.pokerGame.adminName,
            handStatus: GameObject_1.pokerGame.handStatus,
            gameToken: GameObject_1.pokerGame.gameToken,
            buyIn: GameObject_1.pokerGame.buyIn,
            isStarted: GameObject_1.pokerGame.isStarted,
            pot: GameObject_1.pokerGame.pot,
            maxBet: GameObject_1.pokerGame.maxBet,
            tableHand: GameObject_1.pokerGame.tableHand,
            players: this.makePlayers(name),
            toCall: this.makeToCall(name)
        };
    }
    // gets the pokerGame object without any name
    pokerGameBoard() {
        return {
            adminName: GameObject_1.pokerGame.adminName,
            gameToken: GameObject_1.pokerGame.gameToken,
            buyIn: GameObject_1.pokerGame.buyIn,
            maxBet: GameObject_1.pokerGame.maxBet,
            isStarted: GameObject_1.pokerGame.isStarted,
            pot: GameObject_1.pokerGame.pot,
            tableHand: GameObject_1.pokerGame.tableHand,
            // dont send anything as the string to make players because u should know none of the hands
            players: this.makePlayers(""),
        };
    }
}
exports.APIUtils = APIUtils;
//# sourceMappingURL=APIUtils.js.map