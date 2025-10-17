const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const TransactionSchema = new Schema({
  user: {type:Schema.Types.ObjectId, ref:'User'},
  type: {type:String, enum:['credit','debit','bonus','referral','accrual','purchase','withdraw'], required:true},
  amount: {type:Number, required:true},
  note: String,
  createdAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model('Transaction', TransactionSchema);
