// Script Node.js pour créer un admin dans la base MongoDB
// Place ce fichier dans le dossier server puis exécute : node createAdmin.js

const mongoose = require('mongoose');
require('dotenv').config();

const User = require('./models/User');

const MONGO_URI = process.env.MONGO_URI;

async function createAdmin() {
  await mongoose.connect(MONGO_URI);
  const email = process.env.ADMIN_EMAIL || 'admin@tontine.com';
  const password = process.env.ADMIN_PASSWORD;
  if (!password) {
    console.error('Veuillez définir ADMIN_PASSWORD dans votre fichier .env');
    process.exit(1);
  }
  // NE PAS hasher ici, laisser le modèle s'en charger !

  // Vérifie si l'admin existe déjà
  const exists = await User.findOne({ email });
  if (exists) {
    console.log('Un utilisateur admin existe déjà avec cet email.');
    process.exit(0);
  }

  const admin = new User({
    name: 'Admin',
    email,
    password, // en clair, le modèle va hasher
    role: 'admin',
  });
  await admin.save();
  console.log('Admin créé avec succès ! Email :', email, 'Mot de passe : (défini dans .env)');
  process.exit(0);
}

createAdmin().catch(err => {
  console.error(err);
  process.exit(1);
});
