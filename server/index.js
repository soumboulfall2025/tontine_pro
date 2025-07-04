const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

const app = express();
app.use(cors());
app.use(express.json());

// --- Exemple de route test ---
app.get('/', (req, res) => {
  res.send('API TontinePro opérationnelle !');
});

// --- Connexion MongoDB ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tontinepro';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    app.listen(PORT, () => console.log(`Serveur backend lancé sur le port ${PORT}`));
  })
  .catch((err) => console.error('Erreur MongoDB:', err));

// --- Routes ---
const membersRouter = require('./routes/members');
const debtsRouter = require('./routes/debts');
const authRouter = require('./routes/auth');

app.use('/api/members', membersRouter);
app.use('/api/debts', debtsRouter);
app.use('/api/auth', authRouter);

// --- Export pour tests ---
module.exports = app;
