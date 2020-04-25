import React, { Fragment, useState } from 'react'
import { Redirect } from 'react-router';
import Button from '@material-ui/core/Button';
import TextField from '@material-ui/core/TextField';
import {PokerContext} from '../../DrawPokerContext';
import Typography from '@material-ui/core/Typography';
import axios from 'axios';
import GameBoard from '../GameBoard';
import { set } from 'mongoose';


const AdminLanding = () => {

  const {state, dispatch} = React.useContext(PokerContext);
  const [name, setName] = useState('');
  const [errorText, setErrorText] = useState('');
  const [chips, setChips] = useState();
  const [errorChips, setErrorChips] = useState('');
  const [Loading, setLoading] = useState(0);

  // handles the Submit
  async function onSubmit(event) {
    event.preventDefault();

    // make sure the length is at least 4 characters... set Error Accordingly
    Number.isInteger(chips) && chips > 100 ? setErrorChips('') : setErrorChips('Field must be a number') ;
    name.length < 4 ? setErrorText('Must be at least 4 characters') : setErrorText('');

    // if both of the errors are '' meaning there is no error
    if (errorText === '' && errorChips === '') {
      setLoading(1);
      await axios.post('http://localhost:5000/api/players/admin', {
        name : name,
        chips: chips
      }).then(response => {
        let data = response.data;
        dispatch({
          type: "SETUSER",
          payload: data,
      });
      // after dispatch is done, send them to the table
      }).then(response => {
        setLoading(2);
      }).catch(error => {
        setErrorText(error);
        //return "didn't work";
      })
    }
  }



  if (Loading === 0) {

    return (
      <div style={{ display: "block", justifyContent: "center", textAlign: "center", marginTop: "25px" }}>
  
  {/* The header for poker game */}
      <div style= {{ marginBottom: "25px" }}>
      <Typography variant="h2" gutterBottom>
          Poker Game
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
      Create Game
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
  
  {/* // chips buy in */}
  <div style= {{ marginTop : "20px", }}>
      <TextField 
      id="chips_form" 
      label="Chips Buy in" 
      variant="outlined"
      helperText = {errorChips}
      error = {errorChips.length === 0 ? false : true }
      onInput={e=>setChips(e.target.value)}
      />
  </div>
      </div>
  
    )
  };

  if (Loading === 1) {
    return "Loading";
  }
  
  if (Loading === 2) {
    return <Redirect push to="/board" />;
  }

};
export default AdminLanding;