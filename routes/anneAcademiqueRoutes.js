const express = require('express');
const router = express.Router();
const anneeAcademiqueController =  require('./../controllers/anneeAcademiqueController');
router
.route('/').get(anneeAcademiqueController.getAllAnneeAdemique).post(anneeAcademiqueController.createAnneeAdemique);
module.exports = router;