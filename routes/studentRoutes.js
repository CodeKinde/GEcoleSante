const express = require('express');
const router = express.Router();
const studentController = require('./../controllers/etudiantController');
router
.route('/')
.get(studentController.getAllEtudiants)
.post(studentController.createEtudiant)

module.exports = router;