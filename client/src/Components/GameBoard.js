import React, {useEffect, useState} from 'react';
import {PokerContext} from '../DrawPokerContext';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from './Card';
import axios from 'axios';
import PlayerCard from './PlayerCard';
import Typography from '@material-ui/core/Typography';
import { stat } from 'fs';




const useStyles = makeStyles({
    root: {
      background: '#D41B2C',
    },
    main: {
        width: '1000px'
      },
      
    table: {
        backgroundColor: "green",
        height: "500px",
        width: "80%",
        borderRadius: "50%",
        margin: "0 auto",
        border: "1em solid black"
      },
    board: {
        position: "relative",
        top: "40%",
        left: "30%"
      },
    card1: {
      position: "relative",
      top: "10%",
      left: "30%"

    },
    card2: {
      position: "relative",
      top: "30%",
      left: "5%"

    },
    card3: {
      position: "relative",
      top: "70%",
      left: "20%"
    },
    card4: {
      position: "relative",
      top: "65%",
      left: "75%"
    },

    card5: {
      position: "relative",
      top: "20%",
      left: "90%"
    },

    card6: {
      position: "relative",
      top: "-10%",
      left: "70%"
    },

    startGameButton: {
      position: "relative",
      top: "10%",
      left: "30%"
    }


    

  })
 
const GameBoard = () => {
  const {state, dispatch} = React.useContext(PokerContext);
  const classes = useStyles();
  const [startGame, setStartGame] = useState('');
  const [startHand, setStartHand] = useState('');
  
  async function onSubmitStartGame(event) {
    let URL = 'http://localhost:5000/api/game/startGame';
    console.log("thisistoken" + state.token);
    console.log(typeof state.token);
    axios.get(URL, Object.assign({}, {}, { headers: {
      'x-auth-token' : state.token,
    }})).then(response => {
      let game = response.data.game;
      dispatch({
        type: "SETGAME",
        payload : game,
      });
      setStartHand('allowed');
      setStartGame('');
  })
};

async function onSubmitStartHand(event) {
  let URL = 'http://localhost:5000/api/game/startHand';
  console.log("thisistoken" + state.token);
  console.log(typeof state.token);
  axios.get(URL, Object.assign({}, {}, { headers: {
    'x-auth-token' : state.token,
  }})).then(response => {
    let game = response.data.game;
    dispatch({
      type: "SETGAME",
      payload : game,
    });
})
};


  // useEffect for getting the game Board
  useEffect(() => {
    let URL = 'http://localhost:5000/api/game/playerBoard';
    console.log(state.token);
    axios.get(URL, Object.assign({}, {}, { headers: {
      'x-auth-token' : state.token,
    }})).then(response => {
        let game = response.data.game;
        dispatch({
            type: "SETGAME",
            payload: game,
        });
        console.log("admin" + state.pokerGame.isAdmin);
        if (game.isAdmin && (game.isStarted === false)) {
          setStartGame('admin');
        }
        else {
          setStartGame('');
        }
        // set the startHand if hand statuus and game 
        if (state.pokerGame.handStatus === 0 && state.pokerGame.isStarted === true) {
          setStartHand('allowed');
        }
        else {
          setStartHand('');
        }
        console.log(game);
    }).catch(error => {
        console.log(error);
    });

}, [dispatch]);



    if (state.pokerGame === false) {
        return "loading";
    }
    
    return (

        
        <div className={classes.main}>
  <div className={classes.table}>
    <div className = {classes.board}>
        <div>
            {state.pokerGame.tableHand.map((item) => (
                <Card item = {item} />
            ))}
        </div>
    </div>

      <div className = {classes.card1}>
        <PlayerCard index = {0} />

      </div>

      <div className = {classes.card2}>
        
        <PlayerCard index = {1} />
      </div>

      <div className = {classes.card3}>
        <PlayerCard index = {2} />
    </div>

    <div className = {classes.card4}>
        <PlayerCard index = {3} />
    </div>

    <div className = {classes.card5}>
        <PlayerCard index = {4} />
    </div>

    <div className = {classes.card6}>
        <PlayerCard index = {5} />
    </div>
  </div>

  <div className = {classes.startGameButton}>
  <Button 
      variant="contained" 
      size = "large" 
      color="secondary" 
      type="submit"
      disabled={startGame !== 'admin'}
      onClick={e => onSubmitStartGame(e)}>
      >
      Start Game
      </Button> 
  
    <Button 
      variant="contained" 
      size = "large" 
      color="secondary" 
      type="submit"
      disabled={startHand !== 'allowed'}
      onClick={e => onSubmitStartHand(e)}>
      >
      Start Hand
    </Button> 


  </div>
</div>

     )
};
export default GameBoard;
