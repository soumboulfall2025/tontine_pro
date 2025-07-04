const express = require('express');
const Debt = require('../models/Debt');
const Member = require('../models/Member');
const router = express.Router();

// GET toutes les dettes
router.get('/', async (req, res) => {
  const debts = await Debt.find().populate('member');
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
  const debts = await Debt.find({ member: req.params.memberId });
  res.json(debts);
});

// PATCH marquer une dette comme payée
router.patch('/:id/pay', async (req, res) => {
  try {
    const debt = await Debt.findByIdAndUpdate(
      req.params.id,
      { status: 'payée' },
      { new: true }
    );
    if (!debt) return res.status(404).json({ error: 'Dette non trouvée' });
    res.json(debt);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
});

module.exports = router;
