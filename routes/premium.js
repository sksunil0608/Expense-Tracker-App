const express = require('express');
const premiumController = require('../controllers/premium')
const UserAuth = require('../middleware/auth')
const router = express.Router();

router.get("/buy-premium",UserAuth.authenticate,premiumController.getBuyPremium);


router.post("/transaction-status",UserAuth.authenticate,premiumController.postTransactionStatus);

router.post("/check-premium-user",UserAuth.authenticate,premiumController.isPremiumUser);



module.exports = router