import express, {Request, Response} from "express";
export const playerRouter = express.Router();
import {check, validationResult} from "express-validator";
import { Player } from "../../models/player";
import {pokerGame} from "../../GameObject";
import jwt from "jsonwebtoken";
import { userInfo } from "os";
import auth from "../../middleware/auth";
import {APIUtils} from "./APIUtils";

// the util that has the helpers
const apiUtil = new APIUtils();

// @route post api/players/add
// @desc Test route
// add a user to the Game
// @access  Public or private do they need a token to access route
// creates a regular player
playerRouter.post('/add', [
    check('name', 'Name is required').not().isEmpty(),
    check('chips', 'Please include a number of chips').isNumeric(),

]
,  async (req : Request, res : Response) => {
    const errors = validationResult(req);
    // if there are errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    console.log(req.body);
    const {name, chips} = req.body;
    try {

        // check if username is taken
        const taken = await pokerGame.nameChosen({ name});

        if (taken) {
            return res.status(400).json({errors: [{msg: 'Username is taken'}]});
        }
        const player = new Player(false, chips, name);

        // add the player to the game
        pokerGame.addPlayer(player);
        console.log(pokerGame.players);

        const payload = {
            user:{
                id: name
            }
        }
        // this is not secret whatever
        jwt.sign(payload, "mysecrettokoen", {
            expiresIn:3600
        },
        (err, token) => {
           if (err) throw err;
           res.json({token , pokerGame: apiUtil.pokerGameClient(name)});  
        });
        // res.status(200).send("successfully added player");
    }
    catch(err) {
       console.error(err.message);
       res.status(500).send('Server error'); 
    }
    // check if user already entered 


    // get user's gravatar

    // return jsonwebtoken

});

// @route post api/players/admin
// @desc Test route
// add admin to the Game
// @access  Public or private do they need a token to access route
// creates an admin player
playerRouter.post('/admin', [
    check('name', 'Name is required').not().isEmpty(),
    check('chips', 'Please include a number of chips').isNumeric(),

]
,  async (req : Request, res : Response) => {
    const errors = validationResult(req);
    // if there are errors
    if (!errors.isEmpty()) {
        return res.status(400).json({errors: errors.array()})
    }
    console.log(req.body);
    const {name, chips} = req.body;
    try { 
 
        const player = new Player(true, chips, name);

        // add the player to the game
        pokerGame.addPlayer(player);
        pokerGame.setAdmin(name);
        console.log(pokerGame.adminName);
        pokerGame.setBuyIn(chips);
        console.log(pokerGame.adminName);


        const payload = {
            user:{
                id: name
            }
        }
        // this is not secret whatever
        jwt.sign(payload, "mysecrettokoen", {
            expiresIn:3600
        },
        (err, token) => {
           if (err) { throw err};

           return res.status(200).json({token , pokerGame: apiUtil.pokerGameClient(name)});  
        });
    }
    catch(err) {
       console.error(err.message);
       res.status(500).send('Server error'); 
    }
    // check if user already entered 


    // get user's gravatar

    // return jsonwebtoken

});


// @route post api/players/sit
// have a player sit out
// @access  Public or private do they need a token to access route
playerRouter.put('/sit', auth, async (req : Request, res : Response) => {
    const name = req.app.locals.payLoad.user.id;
    console.log(name);
    // make sure the token exists
    if (!name) {
        return res.status(400).json({error: "jwt not found"});
    }
    if (pokerGame.handStatus !== 0) {
        return res.status(401).send("must be the beginning of a hand to sit out");
    }
    // have player sit out 
    try {
        const player = pokerGame.getPlayerByName(name);
        player.setStatus(100);
        return res.status(200).json({game: pokerGame});
    }
    catch {
        return res.status(400).send("not super sure what happened tbh u sent a valid token but no players wid it");
    }
});