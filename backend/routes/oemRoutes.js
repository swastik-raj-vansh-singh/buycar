const express = require('express');
const router = express.Router();
const OEMSpec = require('../models/OEMSpec');

// Create new OEM spec
router.post('/', async (req, res) => {
  try {
    const newSpec = new OEMSpec(req.body);
    const saved = await newSpec.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating OEM spec', error: err });
  }
});

// Get all OEM specs
router.get('/', async (req, res) => {
  try {
    const specs = await OEMSpec.find();
    res.json(specs);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching OEM specs', error: err });
  }
});

// Count all OEM specs
router.get('/count', async (req, res) => {
  try {
    const count = await OEMSpec.countDocuments();
    res.json({ count });
  } catch (err) {
    res.status(500).json({ message: 'Error counting specs', error: err });
  }
});

// Example search for "Honda City 2015"
router.get('/search', async (req, res) => {
  try {
    const found = await OEMSpec.find({
      modelName: 'Honda City',
      modelYear: 2015
    });
    res.json(found);
  } catch (err) {
    res.status(500).json({ message: 'Error searching OEM specs', error: err });
  }
});

module.exports = router;
