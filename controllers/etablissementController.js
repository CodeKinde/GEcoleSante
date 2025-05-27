const Etablissement = require('../models/etablisementModel');
const Factory = require('./handlerFactory');
exports.getAllEtablissement = Factory.getAll(Etablissement);
exports.getEtablissement = Factory.getOne(Etablissement);
exports.updateEtablissement = Factory.updateOne(Etablissement);
exports.deleteEtablissement = Factory.deleteOne(Etablissement);
exports.createEtablissement = Factory.createOne(Etablissement)