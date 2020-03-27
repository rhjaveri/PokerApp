import {Player} from "./player";
import {Deck} from "./deck";
import pokersolver from 'pokersolver';
import { Card } from "./card";
const Hand = pokersolver.Hand;
import {PlayerUtils} from "./PlayerUtils";
const PlayerUtil = new PlayerUtils();

export class Game {
    adminToken: any
    isStarted: boolean;
    pot: number;
    indexBlind: number;
    indexTurn: number;
    deck: Deck;
    players: Player[];
    winner: Player[];
    blindAmount: number;
    requestMade: boolean;
    handComplete: boolean;
    maxBet: number;

    constructor(adminPlayer: Player, adminToken: any) {
        this.isStarted = false;
        this.pot = 0;
        this.indexBlind = 0;
        this.indexTurn = 0;
        this.deck = new Deck();
        this.players = new Array(adminPlayer);
        this.blindAmount = 5;
        this.adminToken = adminToken;
        this.handComplete = false;
        this.maxBet= 0;
        this.requestMade = false;
        // isPlayerShowHands = 
    }

    // A request to start the game can only be made by admin
     startGameRequest(token: any) : void {
         if (token === this.adminToken) {
             this.isStarted = true;
         }
     }

    // adds a player object to the game
    addPlayer(newPlayer: Player) {
        this.players.push(newPlayer);
    }

    // validates that the user making the move is his turn
    validateTurn(token: any) : boolean {
        return token === this.players[this.indexTurn].validateUser(token);
    }
    

    // shuffles a new deck
    newDeck() : void  {
        this.deck.clearGenerate();
    }

    // clears the player's deck
    clearDecks() : void {
        for (const i of this.players) {
            i.clearDeck();
        }
    }
    // clears the chips in the hand for the player
    clearChipsHand() : void {
        for (const i of this.players) {
            i.setChipsInHand(0);
        }
    }


    // sets the information for the next turn
    resetHand() : void { 
        // this.pot = 0; should not reset pot in case there was some extra????
        this.clearDecks();
        this.setStatusesHand();
        this.deck.clearGenerate();
        this.clearChipsHand();
        // the reset of the blind happens after

    }
    // sets all the statuses for players to 1
    setStatusesHand() : void {
        for (const i of this.players) {
            i.setStatus(1);
        }
    }

    // sets the two cards for each player
    setPlayerCards() {
        for (const i of this.players) {
            const card1 : Card = this.deck.getCard();
            const card2 : Card = this.deck.getCard();
            i.setInitialHand(card1, card2);
        }
    }
    // sets the flop in each player's hand
    setFlopCards() : void {
        const card1 : Card = this.deck.getCard();
        const card2 : Card = this.deck.getCard();
        const card3 : Card = this.deck.getCard();
        this.players.forEach(player => player.addFlop(card1, card2, card3));
    }

    // sets the river / turn
    setRiverTurn() : void {
        const card : Card = this.deck.getCard();
        this.players.forEach(player => player.addCard(card));
    }


    // changes turn and sets up the blind
    setBlind() : void {
        this.indexBlind = (this.indexBlind + 1) % this.players.length;
        while (this.players[this.indexBlind].hasEnoughChips(this.blindAmount) === false) {
            this.indexBlind = (this.indexBlind + 1) % this.players.length;
        } 
        this.indexTurn = this.indexBlind + 1;
        // takes the blind from the player and puts in the pot (sets player status to check)
        this.pot += this.blindAmount;
        this.players[this.indexBlind].payChips(this.blindAmount);
        this.players[this.indexBlind].setChipsInHand(this.blindAmount);
        this.players[this.indexBlind].setStatus(0);
        this.maxBet += this.blindAmount;
    }



    handleCall(token : any) : void {
        // check its the correct user
        if (this.validateTurn(token)) {
            const player = this.players[this.indexTurn];

            // they have enough to bet... they don't have to go all in
            if (player.hasEnoughChips(this.maxBet - player.getChipsInHand())) {
                this.pot += (this.maxBet - player.getChipsInHand()); // pot adds chips
                player.payChips(this.maxBet - player.getChipsInHand()); // player loses chips
                player.setChipsInHand(this.maxBet); // player's chips in hand is the max Bet  
                player.setStatus(0);  
            }

            // they don't have enough chips... therefore they are going all in
            else {
                this.pot += player.getChips(); // add whatever chips player has to the pot
                player.addChipsInHand(player.getChips()); // player has added rest of the chips in hand
                player.setChips(0); // player now has zero chips
                player.setStatus(3); // change status to all in
            }
            this.requestMade = true;
        }

        else {
            throw new ErrorEvent("Not your turn");
        }
    }


    // it shouldn't get to someone's turn if they are folded
    handleRaise(token : any, raiseAmt : number) : void {
        if (this.validateTurn(token)) {
            const player = this.players[this.indexTurn];
            const toBet = this.maxBet - player.getChipsInHand() + raiseAmt

            // first check if they have enough to make the raise;
            if (player.hasEnoughChips(toBet)) {
                this.maxBet = this.maxBet + raiseAmt; // raise the max bet
                player.payChips(toBet); // player has to pay the chips he bet
                this.pot += toBet; // increase the pot
                player.setChipsInHand(this.maxBet); // the number of chips tthey have in hand is the max bet

                // for every player not folded or all in, set their status
                for (const i of this.players) {
                    // if same 
                    if (i.getToken() === player.getToken()) {
                        i.setStatus(0);
                    }
                    else if (i.getStatus() === 0 || i.getStatus() === 2) {
                        i.setStatus(1);
                    }
                    else {
                        // do nothing... they're in correct status
                    }
                }
                this.requestMade = true; // set the requestMade status to true
            }
            // don't have enough chips
            else {
                throw new ErrorEvent("not enough chips to raise");
            }
        }
        // not their turn
        else {
            throw new ErrorEvent("Not your turn");
        }
    }

    handleFold(token: any) : void {
        if (this.validateTurn(token)) {
            const player = this.players[this.indexTurn];
            player.setStatus(-1);
            this.requestMade = true;
        }
        else {
            throw new ErrorEvent("Not your turn");
        }
    }

    // sleeps while waiting for a move to be made
    sleep = (ms: number) =>
    new Promise((resolve) => setTimeout(resolve, ms));
    

    // place the bets for the turn
    async placeBetsTurn() {
        // while not players are checked set or folded
        while (PlayerUtil.notAllSet(this.players) === false) {
            const player = this.players[(this.indexTurn)];

            // if they are checked and need to recheck or need to call
            if (player.getStatus() === 2 || player.getStatus() === 1) {
                while (this.requestMade === false) {
                    await this.sleep(50);
                }
                // set it back to false for the rest of the loop
                this.requestMade = false;
                
                // if everyone folded after this turn handle the winners
                if (PlayerUtil.allFolded(this.players)) {
                    this.handleWinners();
                    break;
                }
            }

            this.indexTurn = (this.indexTurn + 1) % this.players.length; // change the turn after the player moves
        }

    }

    // // put all this in the controller
    // playHand() : void {
    //     this.resetHand();
    //     this.setBlind();
    //     this.setPlayerCards();
    //     this.placeBetsTurn();
    //     this.setFlopCards();
    //     this.placeBetsTurn();
    //     this.setRiverTurn();
    //     this.placeBetsTurn();
    //     this.setRiverTurn();
    //     this.placeBetsTurn();
    //     add something here to show the cards and who won
    //     this.handleWinners();
    // }

    // check if there is a winner, and if there is, invokes the end of hand stuff
    // checkWinner() : boolean {
    // }

    // handles the winners by adding the chips to their pile and cleaning the winners array
    handleWinners() : void {
        const winningsEach = this.winner.length;
        for (const i of this.winner) {
            i.addChips(winningsEach);
        }
        this.winner = [];
    }




    // whose turn it is 



    // Add field for the pot;
    // add index of the blind and the person's turn here instead of in the game

    // randomBlind in the beginning
    // set the turn function
}