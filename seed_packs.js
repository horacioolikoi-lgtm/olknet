require('dotenv').config();
const connectDB = require('../config/db');
const Pack = require('../models/Pack');

async function seed(){
  await connectDB();
  const packs = [
    {name:'Starter Pack', price:1000, durationDays:30, dailyReturnPercent:1.0},
    {name:'Growth Pack', price:5000, durationDays:45, dailyReturnPercent:1.2},
    {name:'Pro Pack', price:10000, durationDays:60, dailyReturnPercent:1.5},
  ];
  for(const p of packs){
    const exists = await Pack.findOne({name:p.name});
    if(!exists) await Pack.create(p);
  }
  console.log('Seed done');
  process.exit(0);
}
seed();
