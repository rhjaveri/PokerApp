import { pokerGame } from './gameObject';
import {Game} from './models/game';
import { Card } from './models/card';
import {Player } from './models/player';
import express from 'express';
import pokersolver from 'pokersolver';
import bodyParser from "body-parser";
import {playerRouter} from "./routes/api/players"
import {gameRouter} from "./routes/api/game";
import cors from 'cors';
import socketio from "socket.io";
import http from "http";


const app = express();
app.set("port", process.env.PORT || 5000);

const server = new http.Server(app);
export const io = socketio(server);



app.use(cors());

// logger middleware
function loggerMiddleware(request: express.Request, response: express.Response, next : any) {
    console.log(`${request.method} ${request.path}`);
    next();
};
app.use(loggerMiddleware);


// Init BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));
app.use((req, res, next) => {
    res.header('Access-Control-Allow-Origin', '*');
    next();
  });

app.get('/', (_req: any, res: any) => res.send("API Running"));



// Define Routes
 app.use('/api/game', gameRouter);
 app.use('/api/players', playerRouter);


//  export function emitGame (game : any) : any {
//    console.log("here");
//   io.sockets.emit('game', game);
//  }


// whenever a user connects on port 3000 via
// a websocket, log that a user has connected
io.on("connection", (socket: any) => {
  console.log("a user connected");
});

const PORT = 5000;

server.listen(5000, () => {
  console.log("listening on *:3000");
});

// app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

