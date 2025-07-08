const mongoose = require('mongoose');
const catchAsync = require('../utils/catchAsync');
const Bulletin = require('./../models/bulletinModel');
const Evaluation = require('./../models/evaluationModel');
const Cour = require('./../models/coursModel');
const Student = require('./../models/studentModel');

const Factory = require('./handlerFactory');
const AppError = require('../utils/appError');
exports.getAllBulletin = Factory.getAll(Bulletin);
exports.createBulletin = Factory.createOne(Bulletin);
exports.getBulletin = Factory.getOne(Bulletin);
exports.updateBulletin = Factory.updateOne(Bulletin);
exports.deleteBulletin = Factory.deleteOne(Bulletin);

exports.genererBulletin = catchAsync(async (req, res, next) => {
  const { classeId } = req.params;
  const { anneeAcademiqueId, semestre } = req.body;
  if (!anneeAcademiqueId || !semestre) {
    return next(
      new AppError('anneeAcademiqueId et semestre sont requis.', 400)
    );
  }
  // Étape 1 : Récupérer tous les étudiants de la classe
  const students = await Student.find({ classeId });
  //   console.log(students);

  const results = [];
  for (const student of students) {
    // Étape 2 : Agrégation des moyennes par module pour chaque étudiant
    const notes = await Evaluation.aggregate([
      {
        $match: {
          studentId: student._id,
          semestre,
          anneeAcademiqueId: new mongoose.Types.ObjectId(anneeAcademiqueId),
        },
      },
      {
        $addFields: {
          noteSur20: { $multiply: [{ $divide: ['$note', '$surCombien'] }, 20] },
          notePonderee: {
            $multiply: [{ $divide: ['$note', '$surCombien'] }, 20, '$poids'],
          },
        },
      },
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
        $group: {
          _id: '$courId',
          nomCours: { $first: '$cours.nom' },
          coefficient: { $first: '$cours.coefficient' },
          moyenneModule: { $sum: '$notePonderee' },
        },
      },
      //   {
      //     $group: {
      //       _id: null,
      //       moyenneGenerale: { $avg: '$moyenneModule' },
      //     },
      //   },
    ]);
    // Moyenne pondérée par coefficient
    let totalPonderee = 0;
    let totalCoefficients = 0;

    for (const mod of notes) {
      totalPonderee += mod.moyenneModule * mod.coefficient;
      totalCoefficients += mod.coefficient;
    }
    if (!notes.length) continue;
    const moyenne =
      totalCoefficients > 0 ? totalPonderee / totalCoefficients : 0;
    // Ne crée pas de bulletin si aucune note
    // if (!notes.length) continue;
    // const moyenne = notes[0]?.moyenneGenerale || 0;
    results.push({
      studentId: student._id,
      moyenne,
    });
    console.log(results);

    // Étape 3 : Trier par moyenne descendante
    results.sort((a, b) => b.moyenne - a.moyenne);
    // Étape 4 : Ajouter rang, mention, décision
    results.forEach((r, index) => {
      r.rang = index + 1;
      r.mention = getMention(r.moyenne);
      r.decision = r.moyenne >= 10 ? 'Admis' : 'Ajourné';
    });
    // Étape 5 : Enregistrer les bulletins
    for (const r of results) {
      await Bulletin.findOneAndUpdate(
        {
          studentId: r.studentId,
          classeId,
          semestre,
          anneeAcademiqueId,
        },
        {
          moyenne: r.moyenne,
          rang: r.rang,
          mention: r.mention,
          decision: r.decision,
          semestre,
          anneeAcademiqueId,
          studentId: r.studentId,
          classeId: classeId,
        },
        { upsert: true, new: true }
      );
    }
  }

  return res.status(200).json({
    message: '✅ Bulletins générés avec succès.',
    nombreBulletins: results.length,
    resultats: results,
  });
});

// Mention automatique
function getMention(m) {
  if (m >= 16) return 'Très Bien';
  if (m >= 14) return 'Bien';
  if (m >= 12) return 'Assez Bien';
  if (m >= 10) return 'Passable';
  return 'Insuffisant';
}

exports.bulletinEtudiant = catchAsync(async (req, res, next) => {
  const { studentId } = req.params;
  const { anneeAcademiqueId, semestre } = req.query;
  const student = await Student.findById(studentId).populate({
    path: 'classeId',
    populate: { path: 'filiereId' },
  });
  if (!student) {
    return next(new AppError('etudiant non trouvé'));
  }
  // Étape 1 : Récupérer toutes les évaluations de l'étudiant
  const evaluations = await Evaluation.aggregate([
    {
      $match: {
        studentId: new mongoose.Types.ObjectId(studentId),
        anneeAcademiqueId: new mongoose.Types.ObjectId(anneeAcademiqueId),
        semestre,
      },
    },
    {
      $addFields: {
        noteSur20: { $multiply: [{ $divide: ['$note', '$surCombien'] }, 20] },
        notePonderee: {
          $multiply: [{ $divide: ['$note', '$surCombien'] }, 20, '$poids'],
        },
      },
    },
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
      $group: {
        _id: '$courId',
        nomCours: { $first: '$cour.nom' },
        coefficient: { $first: '$cour.coefficient' },
        evaluations: {
          $push: {
            type: '$type',
            note: '$note',
            surCombien: '$surCombien',
            poids: '$poids',
            notePonderee: '$notePonderee',
            dateEvaluation: '$dateEvaluation',
          },
        },
        moyenneModule: { $sum: '$notePonderee' },
      },
    },
  ]);
  const moyenneGenerale =
    evaluations.length > 0
      ? evaluations.reduce((acc, val) => acc + val.moyenneModule, 0) /
        evaluations.length
      : 0;
  //   console.log(evaluations);
  //   console.log(moyenneGenerale);
  const students = await Student.find({ classeId: student.classeId });
  //   console.log(students);
  const moyennes = [];
  for (const student of students) {
    const bulletin = await Bulletin.findOne({
      studentId: student._id,
      anneeAcademiqueId,
      semestre,
    });
    // console.log(bulletin);

    if (bulletin) {
      moyennes.push({
        studentId: student._id.toString(),
        moyenne: bulletin.moyenne,
      });
    }
  }
  moyennes.sort((a, b) => b.moyenne - a.moyenne);
  const rang = moyennes.findIndex((x) => x.studentId === studentId) + 1;
  //   console.log(moyennes, rang);
  const modulesFiltres = evaluations.map((module) => ({
    nomCours: module.nomCours,
    coefficient: module.coefficient,
    moyenneModeule: parseFloat(moyenneGenerale.toFixed(2)),
    evaluations: module.evaluations.map((e) => ({
      type: e.type,
      note: e.note,
      surCombien: e.surCombien,
      notePonderee: parseFloat(e.notePonderee.toFixed(2)),
      date: e.dateEvaluation.toISOString().split('T')[0],
    })),
  }));
  res.status(200).json({
    student: {
      nom: student.nom,
      prenom: student.prenom,
      classe: student.classeId.nom,
      filière: student.classeId.filiereId.nom,
    },
    anneeAcademiqueId,
    semestre,
    moyenneGenerale: moyenneGenerale.toFixed(2),
    rang,
    mention: getMention(moyenneGenerale),
    decision: moyenneGenerale >= 10 ? 'Admis' : 'Ajourné',
    modules: modulesFiltres,
  });
});

// Fonction pour mention
function getMention(m) {
  if (m >= 16) return 'Très Bien';
  if (m >= 14) return 'Bien';
  if (m >= 12) return 'Assez Bien';
  if (m >= 10) return 'Passable';
  return 'Insuffisant';
}
