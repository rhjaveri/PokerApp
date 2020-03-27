"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
exports.playerRouter = express_1.default.Router();
// @route post api/players
// @desc Test route
// add a user to the Game
// @access  Public or private do they need a token to access route
// creates a regular player
exports.playerRouter.post('/', (req, res) => {
    console.log(req.body);
    res.send('User route');
});
//# sourceMappingURL=players.js.map