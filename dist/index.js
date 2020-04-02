"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const body_parser_1 = __importDefault(require("body-parser"));
const players_1 = require("./routes/api/players");
const game_1 = require("./routes/api/game");
const app = express_1.default();
// logger middleware
function loggerMiddleware(request, response, next) {
    console.log(`${request.method} ${request.path}`);
    next();
}
;
app.use(loggerMiddleware);
// Init BodyParser Middleware
app.use(body_parser_1.default.json());
app.use(body_parser_1.default.urlencoded({ extended: false }));
app.get('/', (_req, res) => res.send("API Running"));
// Define Routes
app.use('/api/game', game_1.gameRouter);
app.use('/api/players', players_1.playerRouter);
const PORT = 5000;
app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));
//# sourceMappingURL=index.js.map