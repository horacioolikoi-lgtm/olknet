const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const UserSchema = new Schema({
  name: {type:String},
  email: {type:String, required:true, unique:true, index:true},
  passwordHash: {type:String, required:true},
  wallet: {type:Number, default:0}, // amount in CFA
  refCode: {type:String, unique:true, index:true},
  referrer: {type:Schema.Types.ObjectId, ref:'User', default:null},
  createdAt: {type:Date, default:Date.now}
});

module.exports = mongoose.model('User', UserSchema);
