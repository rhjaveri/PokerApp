import { Card } from './models/card';
import {Player } from './models/player';
import express from 'express';
import pokersolver from 'pokersolver';
import bodyParser from "body-parser";
import {playerRouter} from "./routes/api/players"
import {gameRouter} from "./routes/api/game";
import cors from 'cors';

const app = express();

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

const PORT = 5000;

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

