const Factory = require('./handlerFactory');
const Cour = require('./../models/coursModel')
exports.getAllCours = Factory.getAll(Cour)
exports.createCour = Factory.createOne(Cour);
exports.getCour = Factory.getOne(Cour);
exports.updateCour = Factory.updateOne(Cour);
exports.deleteCour = Factory.deleteOne(Cour);