const express = require('express');
const router = express.Router();
const adminController = require('../controllers/adminController');
// Note: in prod add admin auth
router.get('/users', adminController.listUsers);
router.get('/packs', adminController.listPacks);
router.post('/packs', adminController.createPack);
router.get('/withdrawals', adminController.listWithdrawals);
router.post('/withdrawals/:id/complete', adminController.completeWithdrawal);

module.exports = router;
