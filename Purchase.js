const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const PurchaseSchema = new Schema({
  user: {type:Schema.Types.ObjectId, ref:'User'},
  pack: {type:Schema.Types.ObjectId, ref:'Pack'},
  amount: Number,
  startDate: Date,
  endDate: Date,
  lastAccrual: Date,
  active: {type:Boolean, default:true},
  createdAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model('Purchase', PurchaseSchema);
