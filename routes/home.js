const express = require('express')
const homeController = require('../controllers/home')

const router = express.Router();

router.get('/',homeController.viewIndex)
router.get('/about',homeController.viewAbout);
router.get('/contact',homeController.viewContact)

module.exports = router