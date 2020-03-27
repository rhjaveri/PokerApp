import { Card } from './models/card';
import {Player } from './models/player';
import {Constants} from './models/constants';
import express from 'express';
import pokersolver from 'pokersolver';
import bodyParser from "body-parser";
import {playerRouter} from "./routes/api/players"
import errorMiddleware from './middleware/error.middleware';

const app = express();

//logger middleware
function loggerMiddleware(request: express.Request, response: express.Response, next : any) {
    console.log(`${request.method} ${request.path}`);
    next();
};
app.use(loggerMiddleware);

// Init BodyParser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended : false}));

//error handling middleware
app.use(errorMiddleware);

app.get('/', (_req: any, res: any) => res.send("API Running"));


// Define Routes
// app.use('/api/game', require('./routes/api/game'));
 app.use('/api/players', playerRouter);

const PORT = 5000;

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

