const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
router.post('/signup', authController.signup)
// router
// .route('/').post(userController.createUser);
module.exports = router