const express = require('express');
const router = express.Router();
const evaluationController = require('./../controllers/evaluationController');
const authController = require('./../controllers/authController');
router.get(
  '/list-by-enseignant',
  evaluationController.getEvaluationByEnseignant
);
router.get('/list-by-filiere', evaluationController.getEvaluationByFiliere);
router.get('/calc-note-student', evaluationController.CalcNoteStudent);

router
  .route('/')
  .get(evaluationController.getAllEvaluations)
  .post(evaluationController.createEvaluation);
router
  .route('/:id')
  .get(evaluationController.getEvaluation)
  .patch(evaluationController.updateEvaluation)
  .delete(evaluationController.deleteEvaluation);
module.exports = router;
