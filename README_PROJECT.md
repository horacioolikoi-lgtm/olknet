OLKNET - Projet (Node.js + MongoDB)
==================================

Contenu :
- Backend Express + Mongoose
- Auth (register/login) with referral and 100 F signup bonus
- Packs, purchases, daily accrual script
- Withdrawals table and admin endpoints to complete withdrawals
- Scripts to seed packs and run accrual once

Install & run (local) :
1. Copy .env.example to .env and fill MONGO_URI & JWT_SECRET
2. npm install
3. npm run init-db
4. node server.js  (or npm run dev with nodemon)

Useful endpoints :
- POST /api/auth/register {name,email,password,refCode?}
- POST /api/auth/login {email,password}
- GET /api/user/me  (Authorization: Bearer <token>)
- GET /api/user/packs (list packs)
- POST /api/user/purchase {packId}
- POST /api/user/withdraw {amount,phone,provider}
- GET /api/admin/users
- POST /api/admin/packs {name,price,durationDays,dailyReturnPercent}
- GET /api/admin/withdrawals
- POST /api/admin/withdrawals/:id/complete

Notes :
- Amounts are in Francs CFA (F).
- The withdrawal processing is left manual/administrative; integrate Moov/MTN API in controllers/adminController.completeWithdrawal for automatic payouts.
- Secure admin routes before production.
