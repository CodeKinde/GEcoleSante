const Etablisement = require('./../models/etablisementModel');
const Factory = require('./handlerFactory');
exports.getAlletablisement = Factory.getAll(Etablisement);
exports.etablisement = Factory.getOne(Etablisement);
exports.updateEtablisement = Factory.updateOne(Etablisement);
exports.deleteEtablisement = Factory.deleteOne(Etablisement);
exports.createEtablisement = Factory.createOne(Etablisement)