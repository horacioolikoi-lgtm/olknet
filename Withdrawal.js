const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const WithdrawalSchema = new Schema({
  user: {type:Schema.Types.ObjectId, ref:'User'},
  amount: Number,
  phone: String,
  provider: String,
  status: {type:String, enum:['pending','completed','failed'], default:'pending'},
  transactionId: String,
  createdAt: {type:Date, default:Date.now},
  updatedAt: Date
});

module.exports = mongoose.model('Withdrawal', WithdrawalSchema);
