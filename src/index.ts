import express from 'express';
import constants from './src/models/constants';
import Deck from './src/models/deck';


const app = express();

app.get('/', (_req: any, res: any) => res.send(`API Running suits are `));

// Define Routes
app.use('/api/players', require('./src/routes/api/players'));
app.use('/api/players', require('./src/routes/api/auth'));

const PORT = 5000;

app.listen(PORT, () => console.log(`Server has started on port ${PORT}`));

