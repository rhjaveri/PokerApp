import { Player } from "./player";

export class PlayerUtils {

    // checks if there is more than one person in the hand (not folded or all in)
    allFolded(players: Player[]) : boolean {
        let countIn = 0
        for (const i of players) {
            if (i.getStatus() === 1 || i.getStatus() === 2 || i.getStatus() === 0 ) {
                countIn += 1;
            }
        }
        // if nobody in something messed up
        if (countIn === 0) {
            throw new Error("no players in");
        }
        return countIn === 1;
    }

    // checks if every player is done betting (for next cards)
    AllSet(Players : Player[]) : boolean {
        for (const i of Players) {
            if (i.getStatus() === 1 || i.getStatus() === 2) {
                return false;
            }
        }
        return true;
    }

   // finds the index of the next player's turn or returns that the round is over
   findNextOrSet(Players : Player[], indexTurn : number) : number {
       const len = Players.length;
       for (let i = 0; i < len; i++) {
           const index = (indexTurn + i) % len;
           if (Players[index].getStatus() === 1 || Players[index].getStatus() === 2) {
               return index;
           }
       }
       return -1;
   } 


}