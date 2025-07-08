const Factory = require('./handlerFactory');
const Etudiant = require('./../models/studentModel');
const User = require('./../models/userModels');
const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');

exports.getEtudiant = Factory.getOne(Etudiant);
exports.deleteEtudiant = Factory.deleteOne(Etudiant);
exports.updateEtudiant = Factory.updateOne(Etudiant);
exports.createEtudiant = catchAsync(async (req, res, next) => {
  const {
    nom,
    prenom,
    phone,
    email,
    anneeAcademiqueId,
    classeId,
    matricule,
    dateNaissance,
    lieuNaissance,
    dateInscription,
    sexe,
    nationalite,
    addresse,
    statuts,
  } = req.body;

  const etudiant = new Etudiant({
    nom,
    prenom,
    phone,
    email,
    anneeAcademiqueId,
    classeId,
    matricule,
    dateNaissance,
    lieuNaissance,
    dateInscription,
    sexe,
    nationalite,
    addresse,
    statuts,
  });
  const savedEtudiants = await etudiant.save();
  res.status(201).json({
    status: 'Success',
    data: savedEtudiants,
  });
});

exports.getEtudiantByClasse = catchAsync(async (req, res) => {
  const classeId = new mongoose.Types.ObjectId(req.params.classeId);
  const studentbyClasses = await Etudiant.aggregate([
    {
      $match: {
        classeId: classeId,
      },
    },

    //jointure par classe
    {
      $lookup: {
        from: 'classes',
        localField: 'classeId',
        foreignField: '_id',
        as: 'classe',
      },
    },
    { $unwind: '$classe' },
    //jointure par année
    {
      $lookup: {
        from: 'anneeacademiques',
        localField: 'anneeAcademiqueId',
        foreignField: '_id',
        as: 'year',
      },
    },
    { $unwind: '$year' },
    {
      $project: {
        _id: 1,
        matricule: 1,
        nom: 1,
        prenom: 1,
        email: 1,
        télephone: 1,
        sexe: 1,
        classe: '$classe.nom',
        niveau: '$classe.niveau',
        dateInscription: 1,
        annee: '$year.nom',
      },
    },
    { $sort: { nom: -1 } },
  ]);
  res.status(200).json({
    status: 'Success',
    results: studentbyClasses.length,
    data: studentbyClasses,
  });
});

exports.getEtudiantByAcademicYear = catchAsync(async (req, res) => {
  const etudiantByYears = await Etudiant.aggregate([
    {
      //jointure avec classe
      $lookup: {
        from: 'classes',
        localField: 'classeId',
        foreignField: '_id',
        as: 'classe',
      },
    },
    { $unwind: '$classe' },
    //Jointure avec année
    {
      $lookup: {
        from: 'anneeacademiques',
        localField: 'anneeAcademiqueId',
        foreignField: '_id',
        as: 'year',
      },
    },
    { $unwind: '$year' },
    {
      //Groupée par annee
      $group: {
        _id: '$year._id',
        année: { $first: '$year.nom' },
        etudiant: {
          $push: {
            nom: '$nom',
            prenom: '$prenom',
            email: '$email',
            Télephone: '$phone',
            matricule: '$matricule',
            classe: '$classe.nom',
            sexe: '$sexe',
          },
        },
      },
    },
    { $sort: { dateInscription: -1 } },
  ]);
  res.status(200).json({
    status: '200',
    data: etudiantByYears,
  });
});

exports.getEtudiantByFiliere = catchAsync(async (req, res) => {
  const filiereId = new mongoose.Types.ObjectId(req.params.filiereId);

  const etudiantbyFiliere = await Etudiant.aggregate([
    //jointure par classe
    {
      $lookup: {
        from: 'classes',
        localField: 'classeId',
        foreignField: '_id',
        as: 'classe',
      },
    },
    { $unwind: '$classe' },
    //jointure par Filiere
    {
      $lookup: {
        from: 'filieres',
        localField: 'classe.filiereId',
        foreignField: '_id',
        as: 'filiere',
      },
    },
    { $unwind: '$filiere' },
    {
      $match: {
        'filiere._id': filiereId,
      },
    },
    {
      $group: {
        _id: '$filiere._id',
        Filière: { $first: '$filiere.nom' },
        Code: { $first: '$filiere.code' },
        etudiants: {
          $push: {
            name: '$nom',
            prenom: '$prenom',
            email: '$email',
            Télephone: '$phone',
            matricule: '$matricule',
            classe: '$classe.nom',
            sexe: '$sexe',
          },
        },
      },
    },
    { $sort: { name: -1 } },
  ]);

  res.status(200).json({
    status: 'Success',
    results: etudiantbyFiliere.length,
    data: etudiantbyFiliere,
  });
});

// Factory.getAll(Etudiant);
exports.getAllEtudiants = catchAsync(async (req, res) => {
  const filters = [];
  if (req.query.classeId) {
    filters.push({
      classeId: new mongoose.Types.ObjectId(req.query.classeId),
    });
  }
  if (req.query.anneeAcademiqueId) {
    filters.push({
      anneeAcademiqueId: new mongoose.Types.ObjectId(
        req.query.anneeAcademiqueId
      ),
    });
  }

  if (req.query.sexe) {
    filters.push({ sexe: req.query.sexe });
  }

  const search = req.query.search;
  const page = parseInt(req.query.page || 1);
  const limit = parseInt(req.query.limit || 10);
  const skip = (page - 1) * limit;

  const etudiants = await Etudiant.aggregate([
    {
      $lookup: {
        from: 'classes',
        localField: 'classeId',
        foreignField: '_id',
        as: 'classe',
      },
    },
    { $unwind: '$classe' },

    {
      $lookup: {
        from: 'filieres',
        localField: 'classe.filiereId',
        foreignField: '_id',
        as: 'filiere',
      },
    },
    { $unwind: '$filiere' },

    {
      $lookup: {
        from: 'anneeacademiques',
        localField: 'anneeAcademiqueId',
        foreignField: '_id',
        as: 'year',
      },
    },
    { $unwind: '$year' },
    // Recherche par nom/prenom/matricule
    ...(search
      ? [
          {
            $match: {
              $or: [
                { $nom: { $regex: search, $options: 'i' } },
                { $prenom: { $regex: search, $options: 'i' } },
                { matricule: { $regex: search, $options: 'i' } },
              ],
            },
          },
        ]
      : []),
    ...(filters.length ? [{ $match: { $and: filters } }] : []),
    {
      $project: {
        _id: 1,
        matricule: 1,
        nom: 1,
        phone: 1,
        email: 1,
        dateInscription: 1,
        dateNaissance: 1,
        lieuNaissance: 1,
        nationalite: 1,
        statut: 1,
        active: 1,
        sexe: 1,
        addresse: 1,
        classe: '$classe.nom',
        niveau: '$classe.niveau',
        filiere: '$filiere.nom',
        Année: '$year.nom',
      },
    },
    { $sort: { nom: 1 } },
    { $skip: skip },
    { $limit: limit },
  ]);
  const total = await Etudiant.countDocuments(filters);
  res.status(200).json({
    status: 'Success',
    total,
    results: etudiants.length,
    page: parseInt(page),
    pages: Math.ceil(total / limit),
    data: etudiants,
  });
});
