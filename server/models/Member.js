const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  avatar: { type: String },
  role: { type: String, enum: ['admin', 'member'], default: 'member' }
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
