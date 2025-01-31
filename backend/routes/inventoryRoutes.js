const express = require('express');
const router = express.Router();
const Inventory = require('../models/Inventory');
const authMiddleware = require('../middleware/authMiddleware');

// Create a new listing (only for logged-in dealers)
router.post('/', authMiddleware, async (req, res) => {
  try {
    const newListing = new Inventory({
      dealer: req.userId,
      ...req.body
    });
    const saved = await newListing.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(500).json({ message: 'Error creating listing', error: err });
  }
});

// Get all listings (with optional filters)
router.get('/', async (req, res) => {
  try {
    const { priceMin, priceMax, color, mileageMax } = req.query;
    let filter = {};

    if (priceMin || priceMax) {
      filter.sellingPrice = {};
      if (priceMin) filter.sellingPrice.$gte = +priceMin;
      if (priceMax) filter.sellingPrice.$lte = +priceMax;
    }

    if (mileageMax) {
      filter.kmOdometer = { $lte: +mileageMax };
    }

    let listings = await Inventory.find(filter)
      .populate('oemSpec')
      .populate('dealer', 'email');

    // Filter by OEM color in-memory (for a quick example):
    if (color) {
      listings = listings.filter(item => 
        item.oemSpec.availableColors.includes(color)
      );
    }

    res.json(listings);
  } catch (err) {
    res.status(500).json({ message: 'Error fetching listings', error: err });
  }
});

// Update a listing (must be owned by logged-in dealer)
router.put('/:id', authMiddleware, async (req, res) => {
  try {
    const updated = await Inventory.findOneAndUpdate(
      { _id: req.params.id, dealer: req.userId },
      { $set: req.body },
      { new: true }
    );
    if (!updated) {
      return res.status(404).json({ message: 'Listing not found or not yours' });
    }
    res.json(updated);
  } catch (err) {
    res.status(500).json({ message: 'Error updating listing', error: err });
  }
});

// Delete multiple listings in one go
router.post('/deleteMany', authMiddleware, async (req, res) => {
  try {
    const { ids } = req.body; // array of listing _ids
    await Inventory.deleteMany({ _id: { $in: ids }, dealer: req.userId });
    res.json({ message: 'Listings deleted successfully' });
  } catch (err) {
    res.status(500).json({ message: 'Error deleting listings', error: err });
  }
});

module.exports = router;
