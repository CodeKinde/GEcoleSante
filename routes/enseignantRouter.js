const express = require('express');
const router = express.Router();
const enseignantController = require('./../controllers/enseignantController');
router.get('/:enseignantId', enseignantController.getEnseignant);
router
.route('/')
.get(enseignantController.getAllEnseignant)
.post(enseignantController.createEnseignant)
router
.route('/:id')
.get(enseignantController.getEnseignant)
.patch(enseignantController.updateEnseignant)
.delete(enseignantController.deleteEnseignant)
module.exports = router;