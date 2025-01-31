const mongoose = require('mongoose');

const oemSpecSchema = new mongoose.Schema({
  modelName: { type: String, required: true },  // e.g. "Honda City"
  modelYear: { type: Number, required: true },  // e.g. 2015
  listPrice: { type: Number, required: true },  // e.g. 1000000
  availableColors: [String],                    // e.g. ["Red", "White"]
  mileage: { type: Number, required: true },    // e.g. 18
  powerBHP: { type: Number, required: true },   // e.g. 98
  maxSpeed: { type: Number, required: true }    // e.g. 180
}, { timestamps: true });

module.exports = mongoose.model('OEMSpec', oemSpecSchema);
