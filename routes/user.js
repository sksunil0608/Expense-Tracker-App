const express = require('express');
const UserAuth = require('../middleware/auth.js')
const userController = require('../controllers/user.js');
const router = express.Router();

//Get Requests
router.get('/login', userController.getLoginView);

router.get('/signup', userController.getSignUpView);

router.get('/logout', userController.getLogout);
//Post Requests
router.post('/signup',userController.postSignUp)

router.post('/login',userController.postLogin)





module.exports = router