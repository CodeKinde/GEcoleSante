const express = require('express');
const router = express.Router();
const courController = require('./../controllers/courController');
const authController = require('./../controllers/authController')
router
.route('/')
.get(courController.getAllCours)
.post(courController.createCour)
router
.route('/:id')
.get(courController.getCour)
.patch(courController.updateCour)
.delete(courController.deleteCour)
module.exports = router;