const Factory = require('./handlerFactory');
const Filiere = require('./../models/filiereModel')

exports.getAllFiliere = Factory.getAll(Filiere)
exports.createFiliere = Factory.createOne(Filiere);
exports.getFiliere = Factory.getOne(Filiere);
exports.updateFiliere = Factory.updateOne(Filiere);
exports.deleteFiliere = Factory.deleteOne(Filiere);