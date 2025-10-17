const express = require('express');
const router = express.Router();
const userController = require('../controllers/userController');
const auth = require('../middlewares/authMiddleware');

router.get('/me', auth, userController.me);
router.get('/packs', auth, userController.listPacks);
router.post('/purchase', auth, userController.purchasePack);
router.post('/withdraw', auth, userController.requestWithdraw);

module.exports = router;
