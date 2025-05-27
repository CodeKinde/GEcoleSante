const express = require('express');
const router = express.Router();
const filiereController = require('./../controllers/filiereController');
router
.route('/')
.get(filiereController.getAllFiliere)
.post(filiereController.createFiliere)
router
.route('/:id')
.get(filiereController.getFiliere)
.update(filiereController.updateFiliere)
.delete(filiereController.deleteFiliere)
module.exports = router;