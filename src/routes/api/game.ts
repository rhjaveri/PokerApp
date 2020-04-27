import { Player } from './../../models/player';
import express, {Request, Response} from "express";
export const gameRouter = express.Router();
import auth from "../../middleware/auth";
import {pokerGame} from "../../GameObject";
import { runInNewContext } from "vm";
import random from 'random';
import {check, validationResult} from "express-validator";
import {APIUtils} from "./APIUtils";
import {io} from "../../index";

// the util that has the helpers
const apiUtil = new APIUtils();



// @route GET game/playerBoard
// @desc handles call for the user
// @access  Public or private do they need a token to access route
gameRouter.get('/playerBoard', auth,  (req : any, res : any) => {
    console.log("here");
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists and user's turn
    if (!name) {
        return res.status(400).json({error: "jwt not found"});
    }

    return res.status(200).json({game : apiUtil.pokerGameClient(name)});

});


// @route PUT game/startGame
// @desc starts the game only if done by admin and only if it hasn't been started
// @access  private
gameRouter.get('/startGame', auth,  (req : any, res : any) => {

    const name = req.app.locals.payLoad.user.id;
    console.log("in start" + name);
    if (name !== pokerGame.adminName && pokerGame.isStarted === false) {
        return res.status(400).send("only the admin can start the game");
    }
    // they are the admin so start the game, with the index and everything
    pokerGame.isStarted = true; // start the game
    
    // set the index of the blind and the player's turn to move
    // pokerGame.indexBlind = random.int(0, pokerGame.players.length - 1);
    pokerGame.indexBlind = 0;

    pokerGame.handStatus = 0;
    console.log(pokerGame.gameToken);
    io.sockets.emit("game", apiUtil.pokerGameClient(name));
    return res.status(200).json({game: apiUtil.pokerGameClient(name)});
});

// @route PUT game/startHand
// @desc starts the hand only if the hand status is zero
// @access public
gameRouter.get('/startHand', auth, (req : any, res : any) => {
    const name = req.app.locals.payLoad.user.id;
    if (!name) {
        return res.status(401).send("This token don't work fool");
    }
    else if (pokerGame.handStatus !== 0) {
        return res.this.state(400).send("In the middle of the hand fool");
    }

    else {
        // start the game with the update 
        pokerGame.update();
        console.log("handStatus" + pokerGame.handStatus);
        console.log(pokerGame);
        io.sockets.emit('game', apiUtil.pokerGameClient(name));
        return res.status(200).json({game: apiUtil.pokerGameClient(name)});
    }
})




// @route GET api/auth
// @desc handles call for the user
// @access  Public or private do they need a token to access route
gameRouter.get('/call', auth,  (req : any, res : any) => {
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists and user's turn
    if (!name) {
        return res.status(400).json({error: "jwt not found"});
    }

    // check not turn 
    if (name !== pokerGame.players[pokerGame.indexTurn].getName()) {
        return res.status(401).send("was not your turn");
    }
    // check poker game is started
    if (pokerGame.isStarted === false || pokerGame.handStatus === 0) {
        return res.status(401).send("game has not been started")
    }
    console.log("here");
    pokerGame.handleCall();
    console.log(pokerGame);
    pokerGame.update();
    console.log(pokerGame);
    io.sockets.emit('game', apiUtil.pokerGameClient(name));
    return res.status(200).json({game : apiUtil.pokerGameClient(name)});

});


// @route GET api/auth
// @desc handles raise for the user
// @access  Public or private do they need a token to access route
gameRouter.post('/raise', auth, [
    check('amount', 'need to send an amount to raise').not().isNumeric()
], async   (req : any, res : any) => {
    console.log("in raise");
    console.log(req.app.locals.payLoad);
    const amount = req.body.amount;
    console.log(amount);
    console.log(amount);
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists
    if (!name) {
        return res.status(400).json({error: "jwt not found"});
    }

    // check it is their turn
    if (name !== pokerGame.players[pokerGame.indexTurn].getName()) {
        return res.status(401).send("was not your turn");
    }

    // check poker game and hand is stacrted
    if (pokerGame.isStarted === false || pokerGame.handStatus === 0) {
        return res.status(401).send("game has not been started")
    }

    console.log(pokerGame.maxBet - pokerGame.players[pokerGame.indexTurn].getChipsInHand() + amount);

    // check if they have enough chips to raise
    if (pokerGame.players[pokerGame.indexTurn].hasEnoughChips(pokerGame.maxBet -
         pokerGame.players[pokerGame.indexTurn].getChipsInHand() + amount) === false) {
             return res.status(401).send("not enough chips to raise")
         }


    console.log(pokerGame);
    pokerGame.handleRaise(amount);
    pokerGame.update();
    io.sockets.emit('game', apiUtil.pokerGameClient(name));
    return res.status(200).json({game : apiUtil.pokerGameClient(name)});

});

// @route PUT api/auth
// @desc handles fold for the user
// @access  Public or private do they need a token to access route
gameRouter.get('/fold', auth,  (req : any, res : any) => {
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists and user's turn
    if (!name) {
        return res.status(400).json({error: "jwt not found"});
    }
    // check not turn 
    if (name !== pokerGame.players[pokerGame.indexTurn].getName()) {
        return res.status(401).send("was not your turn");
    }
    // check poker game is started
    if (pokerGame.isStarted === false || pokerGame.handStatus === 0) {
        return res.status(401).send("game has not been started")
    }
    pokerGame.handleFold();
    pokerGame.update();
    console.log(pokerGame);
    io.sockets.emit('game', apiUtil.pokerGameClient(name));
    return res.status(200).json({game : apiUtil.pokerGameClient(name)});
});

// @route GET api/board
// handles getting the game board for a user at any point
gameRouter.get('/board', (req : any, res : any) => {
    console.log(apiUtil.pokerGameBoard());
    return res.status(200).json({game: apiUtil.pokerGameBoard()});
});

gameRouter.get('/checkIn', auth, (req : any, res : any) => {
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists and user's turn
    if (!name) {
        return res.status(400).json({error: "jwt not found"});
    }
    if (pokerGame.getPlayerByName(name) === null) {
        return res.status(200).send(false);
    }
    else {
        return res.status(200).send(true);
    }
 
});





