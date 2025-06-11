const User = require('./../models/userModels');
const Factory = require('./handlerFactory');

exports.createUser = Factory.createOne(User);
exports.getAllUsers = Factory.getAll(User);