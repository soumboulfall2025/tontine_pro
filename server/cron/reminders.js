// Script de rappels automatiques pour dettes non payées
// À placer dans server/cron/reminders.js
const Debt = require('../models/Debt');
const User = require('../models/User');
const sendSMS = require('../utils/sms');

async function sendReminders() {
  const now = new Date();
  const in2Days = new Date(now.getTime() + 2 * 24 * 60 * 60 * 1000);
  const debts = await Debt.find({ status: 'non payée', date: { $lte: in2Days } }).populate('member');
  for (const debt of debts) {
    if (debt.member && debt.member.phone) {
      await sendSMS(debt.member.phone, `Rappel: Vous devez ${debt.amount} FCFA pour la tontine avant le ${new Date(debt.date).toLocaleDateString()}`);
      // TODO: Logger l’envoi (succès/échec)
    }
  }
}

module.exports = sendReminders;
