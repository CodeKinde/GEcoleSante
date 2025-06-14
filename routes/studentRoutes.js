const express = require('express');
const router = express.Router();
const studentController = require('./../controllers/etudiantController');
router.get('/classe/:classeId', studentController.getEtudiantByClasse);
router.get('/studentByYears', studentController.getEtudiantByAcademicYear);

router
.route('/') 
.get(studentController.getAllEtudiants)
.post(studentController.createEtudiant)

module.exports = router;