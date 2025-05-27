const express = require('express');
const router = express.Router();
const etablissementController =  require('../controllers/etablissementController');
router
.route('/')
.get(etablissementController.getAllEtablissement)
.post(etablissementController.createEtablissement)
router
.route('/:id')
.get(etablissementController.getEtablissement)
.patch(etablissementController.updateEtablissement)
.delete(etablissementController.deleteEtablissement)

module.exports = router;