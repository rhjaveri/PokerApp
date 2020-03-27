import express, {Request, Response} from "express";

export const playerRouter = express.Router();

// @route post api/players
// @desc Test route
// add a user to the Game
// @access  Public or private do they need a token to access route
// creates a regular player
playerRouter.post('/', (req : Request, res : Response) => {
    console.log(req.body);
    res.send('User route');
});
