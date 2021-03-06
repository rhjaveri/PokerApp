# PokerApp
MERN Appication for Private Online Poker Room

Many of the poker rooms available online have restrictions, such as having to pay a fee to access tables or age limits to use the website due to gambling laws. 
And some of them are  inconvenient and time consuming to set up when you want to host a poker game night with friends.
The overall goal of PokerApp is to provide a platform where users can instantly create tables and need only to send a generated ID for friends to join.

Application Stack:
The application is being built with a Node.JS backend (using Express) and a React frontend.
Currently, the application is not databacked, and the state of each game is managed directly on the server.


Current Progress: 
Currently, there is only support for playing a single game. 
The application supports up to 6 users on a single table with real-time communication from the server to each client through Socket.io

<br />
To run app locally: <br />
Download repository and unzip <br />
run npm install in the master folder <br />
run npm start to start the server <br />
in another terminal cd into the client and run npm install <br />
Run npm start in the client to start the client


If no user has created a game, the first client will be presented with the screen <br />
<img src="https://github.com/rhjaveri/PokerApp/blob/master/Screen%20Shot%202020-04-27%20at%203.44.21%20AM.png" width="600" height="400"> <br />

Every client that accesses the game after the admin has created the game will be presented with the screen <br />

<img src="https://github.com/rhjaveri/PokerApp/blob/master/Screen%20Shot%202020-04-27%20at%203.44.41%20AM.png" width="670" height="400"> <br />

The functionality of the pokerGame is is then intuitive, allowing only the admin to start the game once all the users have entered.


<img src="https://github.com/rhjaveri/PokerApp/blob/master/Screen%20Shot%202020-04-27%20at%203.43.05%20AM.png" width="900" height="500"> <br />

<br />
<br />
<br />
TODO: 
fix the functionality for refreshing to saved game (player token is lost) <br />
add database support so that several games can be be player simultaneously <br />
Fix the UI so that the empty (representing an empty seat at the table) fits within the board <br />
