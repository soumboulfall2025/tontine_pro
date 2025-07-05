const express = require("express");
const router = express.Router();
const { sendSMS } = require("../utils/sms");
const { authMiddleware, adminOnly } = require("../middleware/auth");

// Envoyer un SMS à un membre (admin ou membre connecté)
router.post("/send", authMiddleware, async (req, res) => {
  const { to, message } = req.body;
  if (!to || !message) return res.status(400).json({ message: "Numéro ou message manquant" });
  try {
    await sendSMS(to, message);
    res.json({ success: true });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
});

module.exports = router;
