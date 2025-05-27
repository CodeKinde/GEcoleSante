const express = require('express');
const router = express.Router();
const etablissementController =  require('../controllers/etablissementController');
router
.route('/').get(etablissementController.getAllEtablissement).post(etablissementController.createEtablissement);
module.exports = router;