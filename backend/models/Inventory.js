const mongoose = require('mongoose');

const inventorySchema = new mongoose.Schema({
  dealer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  oemSpec: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'OEMSpec',
    required: true
  },
  kmOdometer: Number,
  majorScratches: Boolean,
  originalPaint: Boolean,
  numberOfAccidents: { type: Number, default: 0 },
  numberOfPreviousBuyers: { type: Number, default: 0 },
  registrationPlace: String,

  imageURL: String,
  title: String,
  bulletPoints: [String],
  sellingPrice: Number
}, { timestamps: true });

module.exports = mongoose.model('Inventory', inventorySchema);
