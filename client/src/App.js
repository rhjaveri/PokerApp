import React, {useState} from 'react';
import './App.css';
import Landing from './Components/Landing/Landing';
import {PokerContext} from './DrawPokerContext';
import {BrowserRouter, Route, Switch } from 'react-router-dom';
import GameBoard from './Components/GameBoard';

// clears the localStorage if the date is more than 2 hours 
let hours = 1;
let saved = localStorage.getItem('saved')
if (saved && (new Date().getTime() - saved > hours * 60 * 60 * 1000)) {
  localStorage.clear()
}

const localToken = localStorage.getItem('token');
const localGame = localStorage.getItem("pokerGame");


// set initial state to false or local storage 
const initialState = {
  token : localToken ? JSON.parse(localToken) : false,
  pokerGame : localGame ? JSON.parse(localGame) : false
};

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
      console.log(action.payload);
      localStorage.setItem("pokerGame", JSON.stringify(action.payload));
      localStorage.setItem('saved', new Date().getTime())
      return {
        ...state,
        pokerGame: action.payload,
      };
};
};


function App() {
  const [state, dispatch] = React.useReducer(reducer, initialState);
  console.log("initial");
  console.log(state);
  const [gameToken, setGameToken] = useState(state && state.pokerGame ? state.pokerGame.gameToken : "");
  console.log("state" + state);

  return (
    <PokerContext.Provider value = {{state, dispatch}}> 
    <main>
      <Switch>
        <Route path = '/' render={() => < Landing gameToken = {gameToken} />} />
        <Route path = '/board' component = {GameBoard} />
    
      </Switch>
    </main>
    </PokerContext.Provider>
  );
}

export default App;
