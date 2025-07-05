// Route d'envoi WhatsApp via Twilio
const express = require('express');
const router = express.Router();
const twilio = require('twilio');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const client = twilio(process.env.TWILIO_SID, process.env.TWILIO_TOKEN);

router.post('/send', authMiddleware, adminOnly, async (req, res) => {
  const { to, message } = req.body;
  try {
    await client.messages.create({
      from: 'whatsapp:+14155238886',
      to: `whatsapp:${to}`,
      body: message,
    });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
