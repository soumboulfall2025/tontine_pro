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

module.exports = router;
