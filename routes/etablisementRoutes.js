const express = require('express');
const router = express.Router();
const etablisementController =  require('./../controllers/etablisementController');
router
.route('/').get(etablisementController.getAlletablisement).post(etablisementController.createEtablisement);
module.exports = router;