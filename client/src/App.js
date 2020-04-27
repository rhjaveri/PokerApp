import React, {useState, useEffect} from 'react';
import './App.css';
import Landing from './Components/Landing/Landing';
import {PokerContext} from './DrawPokerContext';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import GameBoard from './Components/GameBoard';
import socketIOClient from "socket.io-client";
import axios from 'axios';
import { Redirect } from 'react-router';
import GameRoute from './Components/GameRoute';

const ENDPOINT = "http://localhost:5000/";


// clears the localStorage if the date is more than 2 hours 
let hours = 1;
let saved = localStorage.getItem('saved')
if (saved && (new Date().getTime() - saved > hours * 60 * 60 * 1000)) {
  localStorage.clear()
}

const localToken = localStorage.getItem('token');
const localGame =  localStorage.getItem("pokerGame");
const localName = localStorage.getItem("name");


// set initial state to false or local storage 
const initialState = {
  token : localToken ? JSON.parse(localToken) : false,
  pokerGame : localGame ? JSON.parse(localGame) : false,
  name : localName ? JSON.parse(localName) : false,

};

const modifySocket = (game, state) => {
  return {
    myChips: state.pokerGame.myChips,
    playerStatus: state.pokerGame.playerStatus,
    isAdmin : state.pokerGame.isAdmin,
    indexTurn: game.indexTurn,
    adminName : state.pokerGame.adminName,
    handStatus: game.handStatus, 
    gameToken : game.gameToken,
    buyIn: state.pokerGame.buyIn,
    isStarted : game.isStarted,
    pot: game.pot,
    maxBet : game.maxBet,
    tableHand: game.tableHand,
    players: game.players,
    toCall: game.toCall
  };

}


const reducer = (state, action) => {
  switch (action.type) {
    case "SETUSER":
      localStorage.setItem("pokerGame", JSON.stringify(action.payload.pokerGame));
      localStorage.setItem("token", JSON.stringify(action.payload.token));
      localStorage.setItem('saved', new Date().getTime())
      return {
        ...state,
        token: action.payload.token,
        pokerGame: action.payload.pokerGame,
        userLoaded: true
      };
    
    case "SETTOKEN":
      console.log(action.payload);
      localStorage.setItem("token", JSON.stringify(action.payload));
      localStorage.setItem('saved', new Date().getTime())
      return {
        ...state,
        token: action.payload,
        };

    case "SETGAME":
      console.log("SETGAME");
      console.log(action.payload);
      localStorage.setItem("pokerGame", JSON.stringify(action.payload));
      localStorage.setItem('saved', new Date().getTime())
      return {
        ...state,
        pokerGame: action.payload,
      };
    case "SETNAME":
      console.log("setting name");
      console.log(action.payload);
      localStorage.setItem("name", JSON.stringify(action.payload));
    return {
      ...state,
      name: action.payload,
    };

    case "SETSOCKET":
      let modifiedGame = modifySocket(action.payload, state);
      console.log("modified");
      console.log(modifiedGame);
      localStorage.setItem("pokerGame", JSON.stringify(action.payload));
      return {
        ...state,
        pokerGame: modifiedGame
      };

    case "SETCHECKED":
      return {
        ...state,
        checkIn : action.payload,
      };

      

};
};


function App() {

  const [state, dispatch] = React.useReducer(reducer, initialState);

  const [gameToken, setGameToken] = useState(state && state.pokerGame ? state.pokerGame.gameToken : "");

  useEffect(() => {
    console.log("token in beginning" + state.token);
    if (state.token === null || state.token === undefined) {
      dispatch({
        type: "SETCHECKED",
        payload: false,
    });
    }
    else {
      let URL = 'http://localhost:5000/api/game/checkIn';
      console.log(state.token);
      axios.get(URL, Object.assign({}, {}, { headers: {
        'x-auth-token' : state.token,
      }})).then(response => {
        let data = response.data;
        if (data === true) {
          dispatch({
            type: "SETCHECKED",
            payload: true,
        });
        }
        else{
          dispatch({
            type: "SETCHECKED",
            payload: false,
        });
        }
    }).then(response => {
      console.log("checkInBegin");
       console.log(state);
    })
  };
    


  }, []);


  return (
    <PokerContext.Provider value = {{state, dispatch}}> 
    <main>
      <Switch>

        <GameRoute />
    
      </Switch>
    </main>
    </PokerContext.Provider>
  );
}

export default App;
