const express = require('express');
const passwordController = require('../controllers/password_management')
const router = express.Router();

router.get('/forgot-password', passwordController.getForgotPasswordView)

router.post('/forgot-password', passwordController.postForgotPassword)

router.get('/reset-password/:uuid', passwordController.getResetPasswordView)


router.use('/update-password/:uuid', passwordController.resetPassword)

module.exports = router

