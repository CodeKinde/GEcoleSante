const express = require('express');
const router = express.Router();
const classeController = require('./../controllers/classeController');
const authController = require('./../controllers/authController')
router
.route('/')
.get(classeController.getAllClasse)
.post(classeController.createClasse)
router
.route('/:id')
.get(classeController.getClasse)
.patch(classeController.updateClasse)
.delete(classeController.deleteClasse)
module.exports = router;