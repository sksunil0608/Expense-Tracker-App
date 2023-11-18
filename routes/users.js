const express = require('express');
const UserAuth = require('../middleware/auth')
const userController = require('../controllers/users.js');
const router = express.Router();

router.post('/signup',userController.postSignUp)

router.post('/login',userController.postLogin)

router.get('/logout',userController.logout);


module.exports = router