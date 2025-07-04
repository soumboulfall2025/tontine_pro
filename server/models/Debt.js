const mongoose = require('mongoose');

const debtSchema = new mongoose.Schema({
  member: { type: mongoose.Schema.Types.ObjectId, ref: 'Member', required: true },
  amount: { type: Number, required: true },
  description: { type: String },
  date: { type: Date, required: true },
  status: { type: String, enum: ['payée', 'non payée'], default: 'non payée' },
}, { timestamps: true });

module.exports = mongoose.model('Debt', debtSchema);
