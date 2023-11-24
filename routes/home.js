const express = require('express')
const homeController = require('../controllers/home')

const router = express.Router();

router.get('/',homeController.getIndexView)
router.get('/about',homeController.getAboutView);
router.get('/contact',homeController.getContactView)

module.exports = router