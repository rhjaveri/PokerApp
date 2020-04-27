import React from 'react';
import GameBoard from './GameBoard';
import Landing from './Landing/Landing';
import {PokerContext} from '../DrawPokerContext';

const GameRoute = () => {
    const {state, dispatch} = React.useContext(PokerContext);

    if (state.checkIn) {
        return <GameBoard />
    }
    else {
        return <Landing />
    }


}
export default GameRoute;
