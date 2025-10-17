const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PackSchema = new Schema({
  name: String,
  price: Number, // in CFA
  durationDays: Number,
  dailyReturnPercent: Number, // e.g. 1.5
  createdAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model('Pack', PackSchema);
