
const express = require('express');
const premiumFeatureController = require('../controllers/premium_feature')
const UserAuth = require('../middleware/auth')
const router = express.Router();

router.get("/leaderboard", UserAuth.authenticate, premiumFeatureController.getLeaderboard);

module.exports = router