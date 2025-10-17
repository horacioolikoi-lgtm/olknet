require('dotenv').config();
const connectDB = require('../config/db');
const { runAccrual } = require('../utils/accrual');

async function main(){
  await connectDB();
  const credited = await runAccrual();
  console.log('Total credited:', credited);
  process.exit(0);
}
main();
