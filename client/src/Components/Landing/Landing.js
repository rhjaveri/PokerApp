import React, {useEffect, useState} from 'react';
import {PokerContext} from '../../DrawPokerContext';
import PlayerLanding from './PlayerLanding';
import AdminLanding from './AdminLanding';
import GameBoard from '../GameBoard';
import axios from 'axios';
import { StatusTypes } from 'react-async';


const Landing = (props) => {
const {state, dispatch} = React.useContext(PokerContext);
const [error, setError] = useState(false);
const [Loading, setLoading] = useState(true);


useEffect( () => {
     axios.get('http://localhost:5000/api/game/board').then(response => {
        let game = response.data.game;
        dispatch({
            type: "SETGAME",
            payload: game,
        });
    }).then(response => {
        setLoading(false);
    }).catch(error => {
        console.log(error);
    });

}, [dispatch]);


// if no game was found
if (Loading) {
    return "Loading";
}    

if (error) {
    return "error";
}

if (state.userLoaded === true) {
    return <GameBoard />;
}

// if they are already logged in dispatch the new game state.
// console.log(props.gameToken);
// console.log(state.pokerGame.gameToken);
console.log(state.pokerGame.gameToken === props.gameToken);
if (state.token !== false && state.pokerGame.gameToken === props.gameToken && Loading === false) {
    return <GameBoard />
}

// if there is no admin in the game
else {
    console.log(state.pokerGame.adminName);
    if (state.pokerGame.adminName !== null) {
        return <PlayerLanding />; 
    }
    else {
    return <AdminLanding />;
    }
}
}


export default Landing;
