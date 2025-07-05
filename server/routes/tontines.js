const express = require("express");
const router = express.Router();
const Tontine = require("../models/Tontine");
const { authMiddleware, adminOnly } = require("../middleware/auth");

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

// Lister les tontines de l'utilisateur
router.get("/mine", authMiddleware, async (req, res) => {
  const tontines = await Tontine.find({ members: req.user._id });
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

module.exports = router;
