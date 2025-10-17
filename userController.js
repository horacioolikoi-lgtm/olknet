const Pack = require('../models/Pack');
const Purchase = require('../models/Purchase');
const Transaction = require('../models/Transaction');
const Withdrawal = require('../models/Withdrawal');
const User = require('../models/User');
const REF_PERCENT = 10; // 10% referral commission

exports.me = async (req,res) => {
  const user = req.user;
  const purchases = await Purchase.find({user:user._id}).populate('pack');
  const transactions = await Transaction.find({user:user._id}).sort({createdAt:-1}).limit(50);
  const referrals = await User.find({referrer:user._id}).select('name email createdAt');
  res.json({ok:true, user, purchases, transactions, referrals});
};

exports.listPacks = async (req,res) => {
  const packs = await Pack.find();
  res.json({ok:true, packs});
};

exports.purchasePack = async (req,res) => {
  try{
    const {packId} = req.body;
    const pack = await Pack.findById(packId);
    if(!pack) return res.status(400).json({error:'Pack not found'});

    // In production you'd validate real payment. Here we assume user paid externally.
    const start = new Date();
    const end = new Date(start.getTime() + pack.durationDays*24*3600*1000);

    const p = await Purchase.create({
      user: req.user._id,
      pack: pack._id,
      amount: pack.price,
      startDate: start,
      endDate: end,
      lastAccrual: start,
      active: true
    });

    await Transaction.create({user:req.user._id, type:'purchase', amount:-pack.price, note:`Achat ${pack.name}`});

    // pay referral commission to referrer if exists
    if(req.user.referrer){
      const bonus = Math.round(pack.price * (REF_PERCENT/100));
      await User.findByIdAndUpdate(req.user.referrer, {$inc: {wallet: bonus}});
      await Transaction.create({user:req.user.referrer, type:'referral', amount:bonus, note:`Referral from ${req.user._id}`});
    }

    res.json({ok:true, purchase:p});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Server error'});
  }
};

// Request withdrawal - will call Mobile Money function (placeholder)
exports.requestWithdraw = async (req,res) => {
  try{
    const {amount, phone, provider} = req.body;
    if(!amount || amount <=0) return res.status(400).json({error:'Invalid amount'});
    if(req.user.wallet < amount) return res.status(400).json({error:'Insufficient balance'});

    // create withdrawal record, status pending
    const w = await Withdrawal.create({user:req.user._id, amount, phone, provider: provider||'Moov', status:'pending'});

    // Here we could asynchronously process payment (call Moov/MTN API). For safety we leave it pending and admin triggers.
    // For now we debit the wallet immediately to block funds
    req.user.wallet -= amount;
    await req.user.save();
    await Transaction.create({user:req.user._id, type:'withdraw', amount:-amount, note:'Withdraw request (pending)'});

    res.json({ok:true, withdrawal:w});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Server error'});
  }
};
