const express = require('express');
const UserAuth = require('../middleware/auth')
const authenticationController = require('../controllers/email');
const router = express.Router();


module.exports = router