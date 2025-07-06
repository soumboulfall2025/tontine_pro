const express = require("express");
const router = express.Router();
const Tontine = require("../models/Tontine");
const { authMiddleware, adminOnly } = require("../middleware/auth");
const crypto = require("crypto");

// Créer une tontine
router.post("/", authMiddleware, async (req, res) => {
  try {
    const { name, description } = req.body;
    const tontine = await Tontine.create({
      name,
      description,
      admin: req.user._id,
      members: [req.user._id],
    });
    res.status(201).json(tontine);
  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});

// Lister les tontines dont l'utilisateur est admin (propriétaire)
router.get("/mine", authMiddleware, async (req, res) => {
  const tontines = await Tontine.find({ admin: req.user._id });
  res.json(tontines);
});

// Rejoindre une tontine (par ID)
router.post("/:id/join", authMiddleware, async (req, res) => {
  const tontine = await Tontine.findById(req.params.id);
  if (!tontine) return res.status(404).json({ message: "Tontine introuvable" });
  if (!tontine.members.includes(req.user._id)) {
    tontine.members.push(req.user._id);
    await tontine.save();
  }
  res.json(tontine);
});

// Rejoindre une tontine via un token d'invitation
router.post("/join/:token", authMiddleware, async (req, res) => {
  const tontine = await Tontine.findOne({ "inviteToken.token": req.params.token });
  if (!tontine || !tontine.inviteToken || tontine.inviteToken.expires < Date.now()) {
    return res.status(400).json({ message: "Lien d'invitation invalide ou expiré" });
  }
  if (!tontine.members.includes(req.user._id)) {
    tontine.members.push(req.user._id);
    await tontine.save();
  }
  res.json({ success: true, tontine });
});

// Détails d'une tontine
router.get("/:id", authMiddleware, async (req, res) => {
  const tontine = await Tontine.findById(req.params.id).populate("members");
  if (!tontine) return res.status(404).json({ message: "Tontine introuvable" });
  res.json(tontine);
});

// (Optionnel) Supprimer une tontine (admin)
router.delete("/:id", authMiddleware, adminOnly, async (req, res) => {
  await Tontine.findByIdAndDelete(req.params.id);
  res.json({ message: "Tontine supprimée" });
});

// Générer un lien d'invitation sécurisé pour une tontine (admin uniquement)
router.post("/:id/invite", authMiddleware, adminOnly, async (req, res) => {
  try {
    const tontine = await Tontine.findById(req.params.id);
    if (!tontine) return res.status(404).json({ message: "Tontine introuvable" });
    if (tontine.admin.toString() !== req.user._id.toString())
      return res.status(403).json({ message: "Non autorisé" });
    // Générer un token unique (valable 48h)
    const token = crypto.randomBytes(24).toString("hex");
    tontine.inviteToken = { token, expires: Date.now() + 48 * 3600 * 1000 };
    await tontine.save();
    const inviteUrl = `${process.env.FRONTEND_URL || "http://localhost:5173"}/invite/${token}`;
    res.json({ inviteUrl });
  } catch (err) {
    console.error("Erreur génération lien invitation:", err);
    res.status(500).json({ message: "Erreur serveur lors de la génération du lien", error: err.message });
  }
});

module.exports = router;
