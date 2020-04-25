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
exports.playerRouter = express_1.default.Router();
const express_validator_1 = require("express-validator");
const player_1 = require("../../models/player");
const GameObject_1 = require("../../GameObject");
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const auth_1 = __importDefault(require("../../middleware/auth"));
const APIUtils_1 = require("./APIUtils");
// the util that has the helpers
const apiUtil = new APIUtils_1.APIUtils();
// @route post api/players/add
// @desc Test route
// add a user to the Game
// @access  Public or private do they need a token to access route
// creates a regular player
exports.playerRouter.post('/add', [
    express_validator_1.check('name', 'Name is required').not().isEmpty(),
    express_validator_1.check('chips', 'Please include a number of chips').isNumeric(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    // if there are errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    const { name, chips } = req.body;
    try {
        // check if username is taken
        const taken = yield GameObject_1.pokerGame.nameChosen({ name });
        if (taken) {
            return res.status(400).json({ errors: [{ msg: 'Username is taken' }] });
        }
        const player = new player_1.Player(false, chips, name);
        // add the player to the game
        GameObject_1.pokerGame.addPlayer(player);
        console.log(GameObject_1.pokerGame.players);
        const payload = {
            user: {
                id: name
            }
        };
        // this is not secret whatever
        jsonwebtoken_1.default.sign(payload, "mysecrettokoen", {
            expiresIn: 3600
        }, (err, token) => {
            if (err)
                throw err;
            res.json({ token, pokerGame: apiUtil.pokerGameClient(name) });
        });
        // res.status(200).send("successfully added player");
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    // check if user already entered 
    // get user's gravatar
    // return jsonwebtoken
}));
// @route post api/players/admin
// @desc Test route
// add admin to the Game
// @access  Public or private do they need a token to access route
// creates an admin player
exports.playerRouter.post('/admin', [
    express_validator_1.check('name', 'Name is required').not().isEmpty(),
    express_validator_1.check('chips', 'Please include a number of chips').isNumeric(),
], (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = express_validator_1.validationResult(req);
    // if there are errors
    if (!errors.isEmpty()) {
        return res.status(400).json({ errors: errors.array() });
    }
    console.log(req.body);
    const { name, chips } = req.body;
    try {
        const player = new player_1.Player(true, chips, name);
        // add the player to the game
        GameObject_1.pokerGame.addPlayer(player);
        GameObject_1.pokerGame.setAdmin(name);
        console.log(GameObject_1.pokerGame.adminName);
        GameObject_1.pokerGame.setBuyIn(chips);
        console.log(GameObject_1.pokerGame.adminName);
        const payload = {
            user: {
                id: name
            }
        };
        // this is not secret whatever
        jsonwebtoken_1.default.sign(payload, "mysecrettokoen", {
            expiresIn: 3600
        }, (err, token) => {
            if (err) {
                throw err;
            }
            ;
            return res.status(200).json({ token, pokerGame: apiUtil.pokerGameClient(name) });
        });
    }
    catch (err) {
        console.error(err.message);
        res.status(500).send('Server error');
    }
    // check if user already entered 
    // get user's gravatar
    // return jsonwebtoken
}));
// @route post api/players/sit
// have a player sit out
// @access  Public or private do they need a token to access route
exports.playerRouter.put('/sit', auth_1.default, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists
    if (!name) {
        return res.status(400).json({ error: "jwt not found" });
    }
    if (GameObject_1.pokerGame.handStatus !== 0) {
        return res.status(401).send("must be the beginning of a hand to sit out");
    }
    // have player sit out 
    try {
        const player = GameObject_1.pokerGame.getPlayerByName(name);
        player.setStatus(100);
        return res.status(200).json({ game: GameObject_1.pokerGame });
    }
    catch (_a) {
        return res.status(400).send("not super sure what happened tbh u sent a valid token but no players wid it");
    }
}));
//# sourceMappingURL=players.js.map