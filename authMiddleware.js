const jwt = require('jsonwebtoken');
const User = require('../models/User');
module.exports = async (req,res,next) => {
  const auth = req.headers.authorization;
  if(!auth) return res.status(401).json({error:'No token'});
  const parts = auth.split(' ');
  if(parts.length!==2) return res.status(401).json({error:'Bad auth'});
  try{
    const payload = jwt.verify(parts[1], process.env.JWT_SECRET || 'secret');
    const user = await User.findById(payload.id);
    if(!user) return res.status(401).json({error:'User not found'});
    req.user = user;
    next();
  }catch(e){
    return res.status(401).json({error:'Invalid token'});
  }
};
