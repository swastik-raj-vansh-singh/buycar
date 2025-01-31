const express = require('express');
const router = express.Router();
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const User = require('../models/User');

// Signup
router.post('/signup', async (req, res) => {
  try {
    const { email, password } = req.body;
    const existing = await User.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: 'User already exists' });
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ email, password: hashedPassword });
    await newUser.save();

    res.status(201).json({ message: 'User created successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error creating user', error: err });
  }
});

// Login
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const match = await bcrypt.compare(password, user.password);
    if (!match) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    const token = jwt.sign(
      { userId: user._id },
      process.env.JWT_SECRET || 'defaultsecret',
      { expiresIn: '1h' }
    );

    res.status(200).json({ token });
  } catch (err) {
    res.status(500).json({ message: 'Error logging in', error: err });
  }
});

module.exports = router;
