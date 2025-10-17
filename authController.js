const User = require('../models/User');
const Transaction = require('../models/Transaction');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const { customAlphabet } = require('nanoid');
const REF_BONUS = 100; // 100 CFA
const nano = customAlphabet('ABCDEFGHJKLMNPQRSTUVWXYZ23456789',6);

exports.register = async (req,res) => {
  try{
    const {name,email,password,refCode} = req.body;
    if(!email || !password) return res.status(400).json({error:'Email and password required'});

    const existing = await User.findOne({email});
    if(existing) return res.status(400).json({error:'Email already used'});

    const hashed = await bcrypt.hash(password, 10);
    const code = nano();

    let referrer = null;
    if(refCode){
      referrer = await User.findOne({refCode});
    }

    const u = new User({
      name: name||'',
      email,
      passwordHash: hashed,
      wallet: REF_BONUS,
      refCode: code,
      referrer: referrer ? referrer._id : null
    });

    await u.save();

    // transaction for signup bonus
    await Transaction.create({user:u._id, type:'bonus', amount:REF_BONUS, note:'Signup bonus'});

    const token = jwt.sign({id:u._id, email:u.email}, process.env.JWT_SECRET || 'secret', {expiresIn:'7d'});
    res.json({ok:true, token, refCode: code});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Server error'});
  }
};

exports.login = async (req,res) => {
  try{
    const {email,password} = req.body;
    if(!email || !password) return res.status(400).json({error:'Email and password required'});
    const u = await User.findOne({email});
    if(!u) return res.status(400).json({error:'Invalid credentials'});
    const ok = await bcrypt.compare(password, u.passwordHash);
    if(!ok) return res.status(400).json({error:'Invalid credentials'});
    const token = jwt.sign({id:u._id, email:u.email}, process.env.JWT_SECRET || 'secret', {expiresIn:'7d'});
    res.json({ok:true, token});
  }catch(e){
    console.error(e);
    res.status(500).json({error:'Server error'});
  }
};
