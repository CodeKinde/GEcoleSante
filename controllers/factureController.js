const Facture = require('../models/factureModel');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
const Factory = require('./handlerFactory');
exports.createFacture = catchAsync(async (req, res, next) => {
  const {
    etudiantId,
    anneeAcademiqueId,
    type,
    mois,
    montantTotal,
    dateEcheance,
  } = req.body;
  if (!etudiantId || !anneeAcademiqueId || !type || !montantTotal) {
    return next(new AppError('Champs requis manquants.', 400));
  }
  // Vérifier le type
  const allowedTypes = ['inscription', 'mensualité', 'examen', 'soutenance'];
  if (!allowedTypes.includes(type)) {
    return next(
      new AppError(
        `Type invalide, type autorisé ${allowedTypes.join(', ')}`,
        400
      )
    );
  }
  // Vérifier le mois si type = mensualité
  if (type === 'mensualité' && !mois) {
    return next(
      new AppError('Le champ mois est requis pour une mensualité.', 400)
    );
  }
  const facture = new Facture({
    etudiantId,
    anneeAcademiqueId,
    type,
    mois: type === 'mensualité' ? mois : undefined,
    montantTotal,
    dateEcheance,
    montantPaye: 0,
    statut: 'impayée',
  });
  await facture.save();
  res.status(201).json({
    status: 'success',
    data: facture,
  });
});

exports.getAllFactures = Factory.getAll(Facture);
exports.getFactureByEtudiant = catchAsync(async (req, res) => {
  const { studentId } = req.params;
  const facture = await Facture.find({ etudiantId: studentId }).populate(
    'paiements'
  );
  res.status(200).json({
    status: 'Success',
    data: facture,
  });
});

exports.getFacture = catchAsync(async (req, res, next) => {
  const { id } = req.params;
  const facture = await Facture.findById(id).populate('paiements');
  if (!facture) return next(new AppError('ID facture invalide!', 400));
  const solde = facture.montantTotal - facture.montantPaye;
  res.status(200).json({
    status: 'Success',
    data: { facture, solde },
  });
});

exports.getSoldeFacture = catchAsync(async (req, res, next) => {
  const { factureId } = req.params;
  console.log(factureId);

  const facture = await Facture.findById(factureId).populate('paiements');

  if (!facture) return next(new AppError('ID facture invalide!', 400));
  const solde = facture.montantTotal - facture.montantPaye;
  res.status(200).json({
    status: 'Success',
    data: { solde },
  });
});
exports.updateFacture = Factory.updateOne(Facture);
exports.deleteFacture = Factory.deleteOne(Facture);
