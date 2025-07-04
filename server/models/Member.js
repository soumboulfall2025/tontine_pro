const mongoose = require('mongoose');

const memberSchema = new mongoose.Schema({
  name: { type: String, required: true },
  phone: { type: String, required: true },
  avatar: { type: String },
}, { timestamps: true });

module.exports = mongoose.model('Member', memberSchema);
