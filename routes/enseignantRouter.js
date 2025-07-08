const express = require('express');
const router = express.Router();
const enseignantController = require('./../controllers/enseignantController');
router
  .route('/')
  .get(enseignantController.getAllEnseignants)
  .post(enseignantController.createEnseignant);
router
  .route('/:id')
  .get(enseignantController.getEnseignant)
  .patch(enseignantController.updateEnseignant)
  .delete(enseignantController.deleteEnseignant);
module.exports = router;
