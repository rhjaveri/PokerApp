import React from 'react';
import { makeStyles } from '@material-ui/core/styles';
import { Html5Entities } from 'html-entities';

// displays each individual card on the table
const useStyles = makeStyles({
    cardSmall: {
        border: ".2em solid black",
        borderRadius: "10%",
        height: "80px",
        width: "56px", /*70% of height*/
        marginRight: "5px",
        float: "left",
        backgroundColor: "white"
       },
      
    cardText: {
        margin: "0",
        marginTop: "15%",
        textAlign: "center",
        fontSize: "1.5em",
        fontWeight: "bold",
        padding: "0"
      },
      
    cardImg: {
        textAlign: "center",
        margin: "0",
        fontSize: "2em"
      },
      
      red: {
        color: "red",
      },
      
      black: {
        color: "black"
      }
      
  })

  const Card = ({item}) => {
    const htmlEntities = new Html5Entities();
    const classes = useStyles()
    let rank =  item.rank;
    let suit;
    switch(item.suit) {
        case 'c':
            suit = "&clubs";
            break;
        case 'd':
            suit = "&diamond";
            break;
        case 'h':
            suit = "&hearts";
            break;
        case 's':
            suit = "&spades";
            break;
    }

    return (
    <div className={classes.cardSmall}>
    <p className={[classes.cardText, classes.black]}>{rank}</p>
    <p className={[classes.cardImg, classes.black]}>{htmlEntities.decode(suit)}</p>
  </div>
    )
}
export default Card;