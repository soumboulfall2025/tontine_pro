// Script de migration pour ajouter la tontine à tous les membres existants
// Usage : node migrate_add_tontine_to_members.js

const mongoose = require('mongoose');
const User = require('./models/User');
const Tontine = require('./models/Tontine');
const dotenv = require('dotenv');
dotenv.config();

const MONGO_URI = process.env.MONGO_URI || 'mongodb://localhost:27017/tontine';

async function main() {
  await mongoose.connect(MONGO_URI);
  // À adapter : récupère l'ID de la tontine cible (ex : la première existante)
  const tontine = await Tontine.findOne();
  if (!tontine) throw new Error('Aucune tontine trouvée');
  const res = await User.updateMany(
    { role: 'member', tontine: { $exists: false } },
    { $set: { tontine: tontine._id } }
  );
  console.log('Membres mis à jour :', res.modifiedCount);
  await mongoose.disconnect();
}

main().catch(console.error);
