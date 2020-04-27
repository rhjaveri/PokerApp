"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
exports.gameRouter = express_1.default.Router();
const auth_1 = __importDefault(require("../../middleware/auth"));
const GameObject_1 = require("../../GameObject");
const express_validator_1 = require("express-validator");
const APIUtils_1 = require("./APIUtils");
const index_1 = require("../../index");
// the util that has the helpers
const apiUtil = new APIUtils_1.APIUtils();
// @route GET game/playerBoard
// @desc handles call for the user
// @access  Public or private do they need a token to access route
exports.gameRouter.get('/playerBoard', auth_1.default, (req, res) => {
    console.log("here");
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists and user's turn
    if (!name) {
        return res.status(400).json({ error: "jwt not found" });
    }
    return res.status(200).json({ game: apiUtil.pokerGameClient(name) });
});
// @route PUT game/startGame
// @desc starts the game only if done by admin and only if it hasn't been started
// @access  private
exports.gameRouter.get('/startGame', auth_1.default, (req, res) => {
    const name = req.app.locals.payLoad.user.id;
    console.log("in start" + name);
    if (name !== GameObject_1.pokerGame.adminName && GameObject_1.pokerGame.isStarted === false) {
        return res.status(400).send("only the admin can start the game");
    }
    // they are the admin so start the game, with the index and everything
    GameObject_1.pokerGame.isStarted = true; // start the game
    // set the index of the blind and the player's turn to move
    // pokerGame.indexBlind = random.int(0, pokerGame.players.length - 1);
    GameObject_1.pokerGame.indexBlind = 0;
    GameObject_1.pokerGame.handStatus = 0;
    console.log(GameObject_1.pokerGame.gameToken);
    index_1.io.sockets.emit("game", apiUtil.pokerGameClient(name));
    return res.status(200).json({ game: apiUtil.pokerGameClient(name) });
});
// @route PUT game/startHand
// @desc starts the hand only if the hand status is zero
// @access public
exports.gameRouter.get('/startHand', auth_1.default, (req, res) => {
    const name = req.app.locals.payLoad.user.id;
    if (!name) {
        return res.status(401).send("This token don't work fool");
    }
    else if (GameObject_1.pokerGame.handStatus !== 0) {
        return res.this.state(400).send("In the middle of the hand fool");
    }
    else {
        // start the game with the update 
        GameObject_1.pokerGame.update();
        console.log("handStatus" + GameObject_1.pokerGame.handStatus);
        console.log(GameObject_1.pokerGame);
        index_1.io.sockets.emit('game', apiUtil.pokerGameClient(name));
        return res.status(200).json({ game: apiUtil.pokerGameClient(name) });
    }
});
// @route GET api/auth
// @desc handles call for the user
// @access  Public or private do they need a token to access route
exports.gameRouter.get('/call', auth_1.default, (req, res) => {
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists and user's turn
    if (!name) {
        return res.status(400).json({ error: "jwt not found" });
    }
    // check not turn 
    if (name !== GameObject_1.pokerGame.players[GameObject_1.pokerGame.indexTurn].getName()) {
        return res.status(401).send("was not your turn");
    }
    // check poker game is started
    if (GameObject_1.pokerGame.isStarted === false || GameObject_1.pokerGame.handStatus === 0) {
        return res.status(401).send("game has not been started");
    }
    console.log("here");
    GameObject_1.pokerGame.handleCall();
    console.log(GameObject_1.pokerGame);
    GameObject_1.pokerGame.update();
    console.log(GameObject_1.pokerGame);
    index_1.io.sockets.emit('game', apiUtil.pokerGameClient(name));
    return res.status(200).json({ game: apiUtil.pokerGameClient(name) });
});
// @route GET api/auth
// @desc handles raise for the user
// @access  Public or private do they need a token to access route
exports.gameRouter.post('/raise', auth_1.default, [
    express_validator_1.check('amount', 'need to send an amount to raise').not().isNumeric()
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    console.log("in raise");
    console.log(req.app.locals.payLoad);
    const amount = req.body.amount;
    console.log(amount);
    console.log(amount);
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists
    if (!name) {
        return res.status(400).json({ error: "jwt not found" });
    }
    // check it is their turn
    if (name !== GameObject_1.pokerGame.players[GameObject_1.pokerGame.indexTurn].getName()) {
        return res.status(401).send("was not your turn");
    }
    // check poker game and hand is stacrted
    if (GameObject_1.pokerGame.isStarted === false || GameObject_1.pokerGame.handStatus === 0) {
        return res.status(401).send("game has not been started");
    }
    console.log(GameObject_1.pokerGame.maxBet - GameObject_1.pokerGame.players[GameObject_1.pokerGame.indexTurn].getChipsInHand() + amount);
    // check if they have enough chips to raise
    if (GameObject_1.pokerGame.players[GameObject_1.pokerGame.indexTurn].hasEnoughChips(GameObject_1.pokerGame.maxBet -
        GameObject_1.pokerGame.players[GameObject_1.pokerGame.indexTurn].getChipsInHand() + amount) === false) {
        return res.status(401).send("not enough chips to raise");
    }
    console.log(GameObject_1.pokerGame);
    GameObject_1.pokerGame.handleRaise(amount);
    GameObject_1.pokerGame.update();
    index_1.io.sockets.emit('game', apiUtil.pokerGameClient(name));
    return res.status(200).json({ game: apiUtil.pokerGameClient(name) });
}));
// @route PUT api/auth
// @desc handles fold for the user
// @access  Public or private do they need a token to access route
exports.gameRouter.get('/fold', auth_1.default, (req, res) => {
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists and user's turn
    if (!name) {
        return res.status(400).json({ error: "jwt not found" });
    }
    // check not turn 
    if (name !== GameObject_1.pokerGame.players[GameObject_1.pokerGame.indexTurn].getName()) {
        return res.status(401).send("was not your turn");
    }
    // check poker game is started
    if (GameObject_1.pokerGame.isStarted === false || GameObject_1.pokerGame.handStatus === 0) {
        return res.status(401).send("game has not been started");
    }
    GameObject_1.pokerGame.handleFold();
    GameObject_1.pokerGame.update();
    console.log(GameObject_1.pokerGame);
    index_1.io.sockets.emit('game', apiUtil.pokerGameClient(name));
    return res.status(200).json({ game: apiUtil.pokerGameClient(name) });
});
// @route GET api/board
// handles getting the game board for a user at any point
exports.gameRouter.get('/board', (req, res) => {
    console.log(apiUtil.pokerGameBoard());
    return res.status(200).json({ game: apiUtil.pokerGameBoard() });
});
exports.gameRouter.get('/checkIn', auth_1.default, (req, res) => {
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists and user's turn
    if (!name) {
        return res.status(400).json({ error: "jwt not found" });
    }
    if (GameObject_1.pokerGame.getPlayerByName(name) === null) {
        return res.status(200).send(false);
    }
    else {
        return res.status(200).send(true);
    }
});
//# sourceMappingURL=game.js.map