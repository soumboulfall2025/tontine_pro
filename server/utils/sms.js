// Exemple d'intégration Twilio (ou autre API SMS)
// Remplacez par vos identifiants Twilio ou Orange
const accountSid = process.env.TWILIO_SID;
const authToken = process.env.TWILIO_TOKEN;
const from = process.env.TWILIO_FROM;
const twilio = require("twilio")(accountSid, authToken);

async function sendSMS(to, message) {
  return twilio.messages.create({
    body: message,
    from,
    to,
  });
}

module.exports = { sendSMS };
