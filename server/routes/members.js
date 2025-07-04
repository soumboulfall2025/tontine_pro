const express = require('express');
const Member = require('../models/Member');
const { authMiddleware, adminOnly } = require('../middleware/auth');
const router = express.Router();

// GET tous les membres (auth requis)
router.get('/', authMiddleware, async (req, res) => {
  const members = await Member.find();
  res.json(members);
});

// POST ajouter un membre (admin uniquement)
router.post('/', authMiddleware, adminOnly, async (req, res) => {
  const member = new Member(req.body);
  await member.save();
  res.status(201).json(member);
});

module.exports = router;
