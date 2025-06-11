const Factory = require('./handlerFactory');
const Etudiant = require('./../models/studentModel');
const User = require('./../models/userModels')
const catchAsync = require('../utils/catchAsync');
exports.getAllEtudiants = Factory.getAll(Etudiant);
exports.getEtudiant = Factory.getOne(Etudiant);
exports.createEtudiant = catchAsync(async (req, res, next) =>{
    const {
        userId,
        anneeAcademiqueId,
        classeId,
        matricule,
        dateNaissance,
        lieuNaissance,
        dateInscription,
        sexe,
        nationalite,
        statuts,
    } = req.body;

    const etudiant = new Etudiant({
        userId,
        anneeAcademiqueId,
        classeId,
        matricule,
        dateNaissance,
        lieuNaissance,
        dateInscription,
        sexe,
        nationalite,
        statuts,
    });
    const savedEtudiants = await etudiant.save();
    res.status(201).json({
        status:"Success",
        data:savedEtudiants
    });
    
}) 
