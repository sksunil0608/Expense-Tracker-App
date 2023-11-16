
const express = require('express');
const premiumFeatureController = require('../controllers/premiumFeatures')
const UserAuth = require('../middleware/auth')
const router = express.Router();

router.get("/premium/leaderboard", UserAuth.authenticate, premiumFeatureController.getLeaderboard);

module.exports = router