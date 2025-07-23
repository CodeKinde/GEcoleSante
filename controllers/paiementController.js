const Student = require('../models/studentModel');
const catchAsync = require('../utils/catchAsync');
const Paiement = require('./../models/paiementModel');
const mongoose = require('mongoose');
exports.createPaiement = catchAsync(async (req, res, next) => {
  const {
    datePaiement,
    categoriePaiement,
    montantPaye,
    montantTotal,
    modePaiement,
    reference,
    statut,
    description,
    studentId,
    anneeAcademiqueId,
  } = req.body;
  const resteApaye = montantTotal - montantPaye;
  const statutFinal = montantPaye >= montantTotal ? 'payé' : statut;
  const paiement = await Paiement.create({
    datePaiement,
    categoriePaiement,
    montantPaye,
    montantTotal,
    modePaiement,
    resteApaye,
    reference,
    statut: statutFinal,
    description,
    studentId,
    anneeAcademiqueId,
  });
  res.status(201).json({
    status: 'success',
    data: paiement,
  });
});
// 2. Liste des paiements d'un étudiant
exports.getPaiementsStudent = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const { annee, categoriePaiement, statut } = req.query;
  const filter = { studentId };
  if (annee) filter.anneeAcademiqueId = annee;
  if (categoriePaiement) filter.categoriePaiement = categoriePaiement;
  if (statut) filter.statut = statut;
  const paiements = await Paiement.find(filter).populate(
    'studentId',
    'nom prenom'
  );
  res.status(200).json({
    status: 'Success',
    results: paiements.length,
    data: paiements,
  });
});
// 3. Calcul global d'un étudiant
exports.calculGlobalStudent = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const { annee } = req.query;
  const filter = { studentId: new mongoose.Types.ObjectId(studentId) };
  if (annee) filter.anneeAcademiqueId = new mongoose.Types.ObjectId(annee);
  const results = await Paiement.aggregate([
    {
      $match: filter,
    },
    {
      $group: {
        _id: '$studentId',
        totalPaye: { $sum: '$montantPaye' },
        totalFacture: { $sum: '$montantTotal' },
      },
    },
    {
      $addFields: {
        resteGlobal: { $subtract: ['$totalFacture', '$totalPaye'] },
      },
    },
  ]);
  const etudiant = await Student.findById(studentId)
    .populate({ path: 'classeId', populate: { path: 'filiereId' } })
    .select('nom prenom email classeId');
  res.status(200).json({
    status: 'Success',
    data: results[0] || { totalPaye: 0, totalFacture: 0, resteGlobal: 0 },
    etudiant,
  });
});

const genererFacture = catchAsync(async (req, res, next) => {});
