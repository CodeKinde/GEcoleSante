const express = require('express');
const router = express.Router();
const factureController = require('./../controllers/factureController');
router.get('/student/:studentId', factureController.getFactureByEtudiant);
router.get('/solde/:factureId', factureController.getSoldeFacture);

router
  .route('/')
  .get(factureController.getAllFactures)
  .post(factureController.createFacture);
router
  .route('/:id')
  .get(factureController.getFacture)
  .delete(factureController.deleteFacture)
  .patch(factureController.updateFacture);
module.exports = router;
