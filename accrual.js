/*
  accrual script: compute daily returns for active purchases
  - run as cron daily or manually by calling scripts/run_accrual_once.js
*/
const Purchase = require('../models/Purchase');
const Transaction = require('../models/Transaction');
const User = require('../models/User');

async function runAccrual(){
  const purchases = await Purchase.find({active:true}).populate('pack');
  let totalCredited = 0;
  const today = new Date();
  for(const p of purchases){
    const last = p.lastAccrual || p.startDate;
    const start = new Date(last);
    const days = Math.floor((today - start)/(24*3600*1000));
    if(days <= 0) continue;
    // compute days remaining until endDate
    const endDate = new Date(p.endDate);
    let allowable = Math.min(days, Math.max(0, Math.floor((endDate - start)/(24*3600*1000))));
    if(allowable <= 0) continue;
    const dailyPercent = p.pack.dailyReturnPercent;
    const dailyAmount = Math.round(p.amount * (dailyPercent/100));
    const total = dailyAmount * allowable;
    // credit user
    await User.findByIdAndUpdate(p.user, {$inc: {wallet: total}});
    await Transaction.create({user:p.user, type:'accrual', amount: total, note:`Accrual for purchase ${p._id} for ${allowable} day(s)`});
    totalCredited += total;
    // update lastAccrual and active flag
    p.lastAccrual = today;
    if(today >= new Date(p.endDate)) p.active = false;
    await p.save();
  }
  return totalCredited;
}

module.exports = { runAccrual };
