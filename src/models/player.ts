import { Card } from './card';
import pokersolver from 'pokersolver';
const Hand = pokersolver.Hand;

export class Player {
    isAdmin: boolean;
    hand: Card[];
    twoCard: Card[]
    // handValue: any;
    chips: number;
    status: number;
    tokenID: any;
    chipsInHand: number;
    avatar : string // not sure what im using this for



    // each player is initialized with being the admin or not
    // and the number of chips they are starting out with
    constructor(isAdmin: boolean, chips: number, tokenID: any) {
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
    setInitialHand(c1 : Card, c2 : Card) : void {
        this.hand.push(c1);
        this.hand.push(c2);
        this.twoCard.push(c1);
        this.twoCard.push(c2);
    }

    // add flop to the player's hand
    addFlop(card1: Card, card2: Card, card3: Card) : void {
        this.hand.push(card1);
        this.hand.push(card2);
        this.hand.push(card3);
    }

    // add card to the players hand
    addCard(card: Card) : void {
        this.hand.push(card);
    }

    // methods for the number of chips player has in hand
    addChipsInHand(chips : number) : void {
        this.chipsInHand += chips;
    }

    setChipsInHand(chips : number) : void {
        this.chipsInHand = chips;
    }
    getChipsInHand() : number {
        return this.chipsInHand;
    }

    // turns the hand into a string for evaluation
    handAsStrings() : string[] {
        const result = new Array();
        for (const i of this.hand) {
            result.push(i.toString());
        }
        return result;
    }


    // somehow validate the user taken
    validateUser(token: any) : boolean {
        return this.tokenID === token;
    }


    // status: -1 is fold
    // 0 is checked/ has already made their move 
    // 2 is checked / needs to make move
    // 1 needs to call to stay in / does need to put more to stay in
    // -1 is folded
    // 3 is all in baby 
    
    // folds a player (out of hand)
    fold() :void {
        this.status = -1;
    }
    isfold() : boolean {
        return this.status === -1;
    }

    // clears the player's deck and the two Card deck
    clearDeck() : void {
        this.hand = [];
        this.twoCard = [];
    }


    // set status to specified
    setStatus(status: number) : void {
        this.status = status;
    }

    // gets the player status
    getStatus() : number {
        return this.status;
    }
    // does the player have the necessary chips to make bet
    hasEnoughChips(betChips: number) : boolean {
        return this.chips > betChips;
    }

    // adds the number of chips the user has
    addChips(chips: number) : void {
        this.chips += chips;
    }

    // takes chips from the player and puts in pot
    payChips(chips: number) : void {
        this.chips -= chips;
    }
    // sets the number of chips player has
    setChips(chips: number) : void {
        this.chips = 0;
    }

    // gets the number of chips player has left
    getChips() : number {
        return this.chips;
    }

    // gets the token ID
    getToken() : any {
        return this.tokenID;
    }
}
