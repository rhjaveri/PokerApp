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

If no user has created a game, the first client will be presented with the screen
