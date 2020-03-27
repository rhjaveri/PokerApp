"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
exports.router = express_1.default.Router();
// @route GET api/auth
// @desc Test route
// add a user to the Game
// @access  Public or private do they need a token to access route
exports.router.get('/', (req, res) => res.send('gameplay route'));
//# sourceMappingURL=game.js.map