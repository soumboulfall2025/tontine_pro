// --- Import des modules ---
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config();

// --- Initialisation de l'application ---
const app = express();

// --- Configuration CORS ---
const allowedOrigins = [
  'http://localhost:5173',
  'https://tontine-pro-client.onrender.com'
];

app.use(cors({
  origin: allowedOrigins,
  credentials: true
}));

// --- Middlewares globaux ---
app.use(express.json());

// --- Route test ---
app.get('/', (req, res) => {
  res.send('✅ API TontinePro opérationnelle !');
});

// --- Connexion MongoDB ---
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tontinepro';

mongoose.connect(MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => {
    console.log('✅ Connecté à MongoDB');
    app.listen(PORT, () => console.log(`🚀 Serveur backend lancé sur le port ${PORT}`));
  })
  .catch((err) => console.error('❌ Erreur MongoDB:', err));

// --- Import des routes ---
const membersRouter = require('./routes/members');
const debtsRouter = require('./routes/debts');
const authRouter = require('./routes/auth');

// --- Utilisation des routes ---
app.use('/api/members', membersRouter);
app.use('/api/debts', debtsRouter);
app.use('/api/auth', authRouter);

// --- Gestion des routes non trouvées ---
app.use((req, res) => {
  res.status(404).json({ message: 'Route non trouvée' });
});

// --- Export pour tests ou index.js si besoin ---
module.exports = app;
