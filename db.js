const mongoose = require('mongoose');
const MONGO_URI = process.env.MONGO_URI;
module.exports = function connectDB(){
  return mongoose.connect(MONGO_URI, {useNewUrlParser:true, useUnifiedTopology:true});
};
