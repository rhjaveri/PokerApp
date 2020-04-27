import React, {useState} from 'react';
import TextField from '@material-ui/core/TextField';
import {PokerContext} from '../../DrawPokerContext';
import Typography from '@material-ui/core/Typography';
import Button from '@material-ui/core/Button';
import axios from 'axios';
import GameBoard from '../GameBoard';
import { Redirect } from 'react-router';




const PlayerLanding = () => {

    const {state, dispatch} = React.useContext(PokerContext);
    const [name, setName] = useState('');
    const [errorText, setErrorText] = useState('');
    const [Loading, setLoading] = useState(0);

    // handles the Submit
    async function onSubmit(event) {
    event.preventDefault();

    // make sure the length is at least 4 characters... set Error Accordingly
    name.length < 4 ? setErrorText('Must be at least 4 characters') : setErrorText('');

    // there's no error with the name
    if (errorText === '') {
      setLoading(1);
      console.log(name);
      console.log(state.pokerGame.buyIn);
        await axios.post('http://localhost:5000/api/players/add', {
            name : name,
            chips : state.pokerGame.buyIn
          }).then(response => {
              let data = response.data;
                dispatch({
                  type: "SETUSER",
                  payload: data,
              });
              dispatch({
                type: "SETNAME",
                payload: name,
              });
              // after dispatch is done, send them to the table
              }).then(response => {
                setLoading(2);
              }).catch(error => {
                console.log(error);
               // setErrorText(error);
              })
            }
          }

          if (Loading === 1) {
            return Loading;
          }

          if (Loading === 2) {
            dispatch({
              type: "SETCHECKED",
              payload: true,
          });
          }

    // render
    return (
        <div style={{ display: "block", justifyContent: "center", textAlign: "center", marginTop: "25px" }}>

        {/* The header for poker game */}
            <div style= {{ marginBottom: "25px" }}>
            <Typography variant="h3" gutterBottom>
                Poker Game: Buy in {state.pokerGame.buyIn} chips
            </Typography>
            </div>


        {/* the Button to create the Game */}
        <Button 
        variant="contained" 
        size = "large" 
        color="secondary" 
        type="submit"
        onClick={e => onSubmit(e)}>
        >
        Join Game
        </Button>
        
        {/* // entering the player's name */}
        <div style= {{ marginTop : "20px", }}>
         <TextField 
        id="name_form" 
        label="User Name" 
        variant="outlined"
        helperText = {errorText}
        error = {errorText.length === 0 ? false : true }
        onInput={e=>setName(e.target.value)}
        />
        </div>

        </div>

    );
}
export default PlayerLanding;