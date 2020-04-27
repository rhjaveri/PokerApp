import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Html5Entities } from 'html-entities';
import ReactHtmlParser from 'react-html-parser';
import {PokerContext} from '../DrawPokerContext';
import HiddenCard from './hiddenCard';
import Typography from '@material-ui/core/Typography';
import Card from './Card';
import { classicNameResolver } from 'typescript';

const PlayerCard = ({index}) => {
    const htmlEntities = new Html5Entities();
    const {state, dispatch} = React.useContext(PokerContext);

    function unescapeHTML(html) {
        var escapeEl = document.createElement("textarea");
        escapeEl.innerHTML = html;
        return escapeEl.textContent;
      }

      

    // check if this person even exists
    if (state.pokerGame.players.length >= index + 1) {


        //  if the person has cards that are visible show all them cards 
        if (state.pokerGame.players[index].twoCard && state.pokerGame.players[index].twoCard !== []) {
            //console.log(html);
            return (
                <div  style={{ boxShadow: "0 0 10px white"}}>
                <Typography variant="h6" gutterBottom>
                {state.pokerGame.players[index].name} :  {state.pokerGame.players[index].chips} chips 
            </Typography>
            <div>
                {state.pokerGame.players[index].twoCard.map((item) => (
                <Card item = {item} />
    ))}
        </div>
            </div>
            );
        }

        // if their cards are hidden show the hidden Card
        else {
            return <HiddenCard name = {state.pokerGame.players[index].name} chips = {state.pokerGame.players[index].chips} />
        }
    }
    // return some kinda weird picture showing nobody is there
    else {
        return "Empty"
    }
}
export default PlayerCard;
