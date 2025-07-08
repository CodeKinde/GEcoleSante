const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const Evaluation = require('./../models/evaluationModel');
const Factory = require('./handlerFactory');

exports.getAllEvaluations = Factory.getAll(Evaluation);
exports.createEvaluation = Factory.createOne(Evaluation);
exports.getEvaluation = Factory.getOne(Evaluation);
exports.updateEvaluation = Factory.updateOne(Evaluation);
exports.deleteEvaluation = Factory.deleteOne(Evaluation);
///Liste Evaluation par Etudiant, filiere et Enseignant
exports.getEvaluationByEnseignant = catchAsync(async (req, res) => {
  const enseignantId = new mongoose.Types.ObjectId(req.query.enseignantId);

  const evaluations = await Evaluation.aggregate([
    {
      $lookup: {
        from: 'cours',
        localField: 'courId',
        foreignField: '_id',
        as: 'cours',
      },
    },
    { $unwind: '$cours' },
    {
      $lookup: {
        from: 'enseignants',
        localField: 'cours.enseignantId',
        foreignField: '_id',
        as: 'enseignant',
      },
    },
    { $unwind: '$enseignant' },
    // ...(filters.length ? [{ $match: { $and: filters } }] : []),
    {
      $match: {
        'cours.enseignantId': enseignantId,
      },
    },
    {
      $project: {
        type: 1,
        note: 1,
        surCombien: 1,
        dateEvaluation: 1,
        studentId: 1,
        courNom: '$cours.nom',
        enseignantNom: '$enseignant.prenom',
        enseignantPrenom: '$enseignant.nom',
      },
    },
  ]);
  res.status(200).json({
    status: 'Success',
    data: evaluations,
  });
});

exports.getEvaluationByFiliere = catchAsync(async (req, res) => {
  const filiereId = new mongoose.Types.ObjectId(req.query.filiereId);
  const evalutions = await Evaluation.aggregate([
    {
      $lookup: {
        from: 'students',
        localField: 'studentId',
        foreignField: '_id',
        as: 'student',
      },
    },
    { $unwind: '$student' },
    {
      $lookup: {
        from: 'classes',
        localField: 'student.classeId',
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
        from: 'cours',
        localField: 'courId',
        foreignField: '_id',
        as: 'cour',
      },
    },
    { $unwind: '$cour' },
    {
      $match: {
        'classe.filiereId': filiereId,
      },
    },
    {
      $project: {
        type: 1,
        note: 1,
        semestre: 1,
        etudiantPrenom: '$student.prenom',
        etudiantNom: '$student.nom',
        semestre: 1,
        cour: '$cour.nom',
        classe: '$classe.nom',
        filiere: '$filiere.nom',
      },
    },
  ]);
  res.status(200).json({
    status: 'success',
    data: evalutions,
  });
});

exports.CalcNoteStudent = catchAsync(async (req, res) => {
  const studentId = new mongoose.Types.ObjectId(req.query.studentId);
  const evaluationResult = await Evaluation.aggregate([
    {
      $match: {
        studentId: studentId,
      },
    },
    {
      $addFields: {
        noteSur20: {
          $multiply: [{ $divide: ['$note', '$surCombien'] }, 20],
        },
      },
    },
    {
      // 3. Récupérer les données du cours (coefficient + nom)
      $lookup: {
        from: 'cours',
        localField: 'courId',
        foreignField: '_id',
        as: 'cour',
      },
    },
    { $unwind: '$cour' },
    {
      // 3. Récupérer les données du cours (coefficient + nom)
      $lookup: {
        from: 'students',
        localField: 'studentId',
        foreignField: '_id',
        as: 'student',
      },
    },
    { $unwind: '$student' },
    // 4. Calcul note pondérée pour chaque évaluation (note * poids)
    {
      $addFields: {
        notePonderee: {
          $multiply: ['$noteSur20', '$poids'],
        },
      },
    },
    {
      $group: {
        _id: '$courId',
        nomCours: { $first: '$cour.nom' },
        coefficient: { $first: '$cour.coefficient' },
        studentNom: { $first: '$student.nom' },

        totalNotePonderee: { $sum: '$notePonderee' },
      },
    },
    // 6. Calcul de la moyenne * coefficient (résultat final pondéré)
    {
      $project: {
        _id: 0,
        courId: '$_id',
        nomCours: 1,
        coefficient: 1,
        studentNom: 1,
        moyenneSur20: { $round: ['$totalNotePonderee', 2] },
        noteBulletin: {
          $round: [{ $multiply: ['$totalNotePonderee', '$coefficient'] }, 2],
        },
      },
    },
    // {
    //   $group:{
    //     _id:"$courId",
    //     total:{
    //       $sum:{
    //         $multiply:['$noteSur20', '']
    //       }
    //     }
    //   }
    // }
  ]);

  res.status(200).json({
    status: 'Success',
    data: evaluationResult,
  });
});
