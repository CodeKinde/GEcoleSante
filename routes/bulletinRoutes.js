const express = require('express');
const router = express.Router();
const bulletinController = require('./../controllers/bulletinController');
const authController = require('./../controllers/authController');
router.post('/generer/:classeId', bulletinController.genererBulletin);
router.get('/student/:studentId', bulletinController.bulletinEtudiant);

router
  .route('/')
  .get(bulletinController.getAllBulletin)
  .post(bulletinController.createBulletin);
router
  .route('/:id')
  .get(bulletinController.getBulletin)
  .patch(bulletinController.updateBulletin)
  .delete(bulletinController.deleteBulletin);
module.exports = router;
