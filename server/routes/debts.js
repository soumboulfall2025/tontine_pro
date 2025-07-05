const express = require('express');
const Debt = require('../models/Debt');
const Member = require('../models/Member');
const router = express.Router();

// GET toutes les dettes
router.get('/', async (req, res) => {
  const debts = await Debt.find().populate('member paidBy');
  res.json(debts);
});

// POST ajouter une dette
router.post('/', async (req, res) => {
  const debt = new Debt(req.body);
  await debt.save();
  res.status(201).json(debt);
});

// GET dettes d'un membre
router.get('/member/:memberId', async (req, res) => {
  const debts = await Debt.find({ member: req.params.memberId }).populate('member paidBy');
  res.json(debts);
});

// PATCH marquer une dette comme payée
router.patch('/:id/pay', async (req, res) => {
  try {
    const update = { status: 'payée' };
    if (req.body.paidBy) update.paidBy = req.body.paidBy;
    const debt = await Debt.findByIdAndUpdate(
      req.params.id,
      update,
      { new: true }
    );
    if (!debt) return res.status(404).json({ error: 'Dette non trouvée' });
    res.json(debt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

// DELETE supprimer une dette
router.delete('/:id', async (req, res) => {
  try {
    const debt = await Debt.findByIdAndDelete(req.params.id);
    if (!debt) return res.status(404).json({ error: 'Dette non trouvée' });
    res.json({ success: true });
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
