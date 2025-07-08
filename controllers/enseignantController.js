const Factory = require('./handlerFactory');
const Enseignant = require('./../models/enseignantModel');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose');

exports.getAllEnseignants = Factory.getAll(Enseignant);

exports.getEnseignant = Factory.getOne(Enseignant);
exports.createEnseignant = Factory.createOne(Enseignant);

exports.updateEnseignant = Factory.updateOne(Enseignant);
exports.deleteEnseignant = Factory.deleteOne(Enseignant);
