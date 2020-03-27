import express, {Request, Response} from "express";
export const router = express.Router();

// @route GET api/auth
// @desc Test route
// add a user to the Game
// @access  Public or private do they need a token to access route
router.get('/', (req : any, res : any) => res.send('gameplay route'));
