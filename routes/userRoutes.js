const express = require('express');
const router = express.Router();
const authController = require('./../controllers/authController');
const userController = require('./../controllers/userController');

router.post('/signup', authController.signup)
router.get('/login', authController.login)

router
.route('/').get(userController.getAllUsers);
module.exports = router