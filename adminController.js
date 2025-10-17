const User = require('../models/User');
const Pack = require('../models/Pack');
const Withdrawal = require('../models/Withdrawal');
const Transaction = require('../models/Transaction');

exports.listUsers = async (req,res) => {
  const users = await User.find().select('-passwordHash').sort({createdAt:-1}).limit(200);
  res.json({ok:true, users});
};

exports.listPacks = async (req,res) => {
  const packs = await Pack.find().sort({price:1});
  res.json({ok:true, packs});
};

exports.createPack = async (req,res) => {
  const {name, price, durationDays, dailyReturnPercent} = req.body;
  const p = await Pack.create({name, price, durationDays, dailyReturnPercent});
  res.json({ok:true, pack:p});
};

exports.listWithdrawals = async (req,res) => {
  const w = await Withdrawal.find().populate('user').sort({createdAt:-1});
  res.json({ok:true, withdrawals:w});
};

// In a production system this would call the MoMo API. Here we mark completed and create transaction.
exports.completeWithdrawal = async (req,res) => {
  const id = req.params.id;
  const w = await Withdrawal.findById(id);
  if(!w) return res.status(404).json({error:'Not found'});
  if(w.status === 'completed') return res.status(400).json({error:'Already completed'});
  // mark completed (in real life after MoMo callback success)
  w.status = 'completed';
  w.transactionId = 'manual-'+Date.now();
  w.updatedAt = new Date();
  await w.save();

  // ensure user exists and transaction recorded (wallet already debited at request)
  await Transaction.create({user:w.user, type:'withdraw', amount:-w.amount, note:`Withdrawal completed ${w._id}`});

  res.json({ok:true, withdrawal:w});
};
