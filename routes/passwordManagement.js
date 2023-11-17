const express = require('express');
const passwordController = require('../controllers/passwordManagement')
const router = express.Router();


router.use('/password/forgotpassword', passwordController.postForgotPassword)

router.get('/password/resetpassword/:uuid', passwordController.getResetPassword)


router.use('/password/updatepassword/:uuid', passwordController.postUpdatePassword)

module.exports = router

