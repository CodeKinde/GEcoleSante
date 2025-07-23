const express = require('express');
const router = express.Router();
const paiementController = require('./../controllers/paiementController');
const authController = require('./../controllers/authController');
router.get('/student/:studentId', paiementController.getPaiementsStudent);
router.get(
  '/statut/student/:studentId',
  paiementController.calculGlobalStudent
);

router
  .route('/')
  //   .get(paiementController.getPaiementsStudent)
  .post(paiementController.createPaiement);
module.exports = router;
