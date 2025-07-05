const express = require('express');
const User = require('../models/User');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET tous les membres (auth requis, filtrage par tontine possible)
router.get('/', authMiddleware, async (req, res) => {
  const filter = { role: 'member' };
  if (req.query.tontine) filter.tontine = req.query.tontine;
  const members = await User.find(filter);
  res.json(members);
});

// POST ajouter un membre (admin uniquement, association à une tontine)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  try {
    const { name, email, phone, password, avatar, tontine } = req.body;
    const user = new User({ name, email, phone, password, avatar, role: 'member', tontine });
    await user.save();
    res.status(201).json(user);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE supprimer un membre (admin uniquement)
router.delete('/:id', authMiddleware, adminOnly, async (req, res) => {
  try {
    const user = await User.findByIdAndDelete(req.params.id);
    if (!user) return res.status(404).json({ error: 'Membre non trouvé' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
