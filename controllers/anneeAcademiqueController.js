const AnneeAdemique = require('./../models/anneeAcademiqueModel');
const Factory = require('./handlerFactory');
exports.getAllAnneeAdemique = Factory.getAll(AnneeAdemique);
exports.getAnneeAdemique = Factory.getOne(AnneeAdemique);
exports.updateAnneeAdemique = Factory.updateOne(AnneeAdemique);
exports.deleteAnneeAdemique = Factory.deleteOne(AnneeAdemique);
exports.createAnneeAdemique = Factory.createOne(AnneeAdemique)