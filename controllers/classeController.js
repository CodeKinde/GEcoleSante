const Factory = require('./handlerFactory');
const Classe = require('./../models/classeModel')
exports.getAllClasse = Factory.getAll(Classe)
exports.createClasse = Factory.createOne(Classe);
exports.getClasse = Factory.getOne(Classe);
exports.updateClasse = Factory.updateOne(Classe);
exports.deleteClasse = Factory.deleteOne(Classe);