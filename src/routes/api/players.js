const express = require('express');
const router = express.Router();

// @route GET api/players
// @desc Test route
// add a user to the Game
// @access  Public or private do they need a token to access route
router.get('/', (req, res) => res.send('Player route'));

module.exports = router;