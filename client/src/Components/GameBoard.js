import React, {useEffect, useState} from 'react';
import {PokerContext} from '../DrawPokerContext';
import { makeStyles } from '@material-ui/core/styles';
import Button from '@material-ui/core/Button';
import Card from './Card';
import axios from 'axios';
import PlayerCard from './PlayerCard';
import Typography from '@material-ui/core/Typography';
import { stat } from 'fs';
import NumericInput from 'react-numeric-input';
import TextField from '@material-ui/core/TextField';
import { isNumeric } from 'tslint';
import socketIOClient from "socket.io-client";
const ENDPOINT = "http://localhost:5000/";





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
    actionButtons: {
      position: "absolute",
      top: "10%",
      left: "65%",
    },
    card1: {
      position: "absolute",
      top: "5%",
      left: "30%",
      verticalAlign: "top"

    },
    card2: {
      position: "absolute",
      top: "20%",
      left: "10%",
      verticalAlign: "top"

    },
    card3: {
      position: "absolute",
      top: "50%",
      left: "17%",
      verticalAlign: "top"
    },
    card4: {
      position: "absolute",
      top: "47%",
      left: "43%",
      verticalAlign: "top"
    },

    card5: {
      position: "relative",
      top: "20%",
      left: "80%",
      verticalAlign: "top"
    },

    card6: {
      position: "relative",
      top: "-10%",
      left: "70%",
      verticalAlign: "top"
    },

    startGameButton: {
      left: "30%",
      marginTop: "20px",
      position: "relative",
      top: "10%",
      verticalAlign: "top"
    },

    raiseButton: {
      paddingTop: "25px",
      marginTop:"10px",
      marginBottom: "20px"
    },

    callButton: {
      paddingBottom: "25px"
    }


    

  })
 
const GameBoard = () => {
  const {state, dispatch} = React.useContext(PokerContext);
  const classes = useStyles();
  const [startGame, setStartGame] = useState('');
  const [startHand, setStartHand] = useState('');
  const [chips, setChips] = useState(0);
  const [CallOrCheck, setCallOrCheck] = useState('');



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

async function onSubmitCall(event) {
  let URL = 'http://localhost:5000/api/game/call';
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

async function onSubmitFold(event) {
  let URL = 'http://localhost:5000/api/game/fold';
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


async function onSubmitRaise(event) {
  console.log("chihps" + chips);
  let URL = 'http://localhost:5000/api/game/raise';
  console.log("thisistoken" + state.token);
  console.log(typeof state.token);
  console.log(chips);

  axios({
    method: 'post',
    url: URL,
    headers: {'x-auth-token' : state.token}, 
    data: {
      amount: Number(chips), // This is the body part
    }
  }).then(response => {
    let game = response.data.game;
    dispatch({
      type: "SETGAME",
      payload : game,
    });
    console.log(state.pokerGame);
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

function findThisPlayerChips(name) {
  for (let p of state.pokerGame.players) {
    if (p.name === name) {
      return p.chipsInHand;
    }
  }
  return null;
}



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

    const socket = socketIOClient(ENDPOINT);
    socket.on("game", data => {
  
      console.log("socket data");
      console.log(data);
      console.log(data.gameToken);
      console.log(state.pokerGame.gameToken);
      console.log(state);
      if (state.token !== false) {
      console.log("it is dispathing");
      dispatch({
        type: "SETSOCKET",
        payload : data,
      });
    }
    });

}, [dispatch]);



    if (state.pokerGame === false) {
        return "loading";
    }
    console.log("the players and index");
    console.log(state.pokerGame.players[state.pokerGame.indexTurn]);
    console.log(state.name);
    console.log(findThisPlayerChips(state.name));
    console.log(state.pokerGame.maxBet);
    
    return (

        
        <div className={classes.main}>
  <div className={classes.table}>
    <div className = {classes.board}>
        <div>
        <Typography variant="h6" gutterBottom>
      Pot: {state.pokerGame.pot}
      </Typography>
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
      disabled={state.pokerGame.isStarted === false || state.pokerGame.handStatus !== 0}
      onClick={e => onSubmitStartHand(e)}>
      >
      Start Hand
    </Button> 
  
  </div>

<div className = {classes.actionButtons}>
  <div className = {classes.callButton}>
    <Button
    variant="contained" 
    size = "large" 
    color="secondary" 
    type="submit"
    disabled={state.pokerGame.players[state.pokerGame.indexTurn].name !== state.name || state.pokerGame.handStatus === 0 || state.pokerGame.playerStatus === -1}
    onClick={e => onSubmitCall(e)}>
      {state.pokerGame.toCall === 0 ? 'check' : 'call'}
    </Button>
    </div>

    <Button
    variant="contained" 
    size = "large" 
    color="secondary" 
    type="submit"
    disabled={state.pokerGame.players[state.pokerGame.indexTurn].name !== state.name || state.pokerGame.handStatus === 0 || state.pokerGame.playerStatus === -1 || state.pokerGame.maxBet - findThisPlayerChips(state.name) === 0}
    onClick={e => onSubmitFold(e)}>
    >
      Fold
  </Button>

<div className= {classes.raiseButton} >
<TextField 
      id="name_form" 
      size = "small"
      label="Chips" 
      variant="outlined"
      onInput={e=>setChips(e.target.value)}
      />
<Button
    variant="contained" 
    size = "large" 
    color="secondary" 
    type="submit"
    disabled={state.pokerGame.players[state.pokerGame.indexTurn].name !== state.name || state.pokerGame.handStatus === 0 || state.pokerGame.playerStatus === -1 }
    onClick={e => onSubmitRaise(e)}>
    >
      Raise
</Button>
</div>

<Typography variant="h5" gutterBottom>
    To Call: {state.pokerGame.maxBet - findThisPlayerChips(state.name)}
</Typography>

<Typography variant="h5" gutterBottom>
    My Chips: {state.pokerGame.myChips}
</Typography>

  </div>

</div>

     )
};
export default GameBoard;
