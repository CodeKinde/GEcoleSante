const mongoose = require('mongoose');
const evaluationSchema = new mongoose.Schema(
  {
    type: {
      type: String,
      enum: ['devoir', 'examen', 'TP', 'oral'],
      required: true,
    },
    semestre: {
      type: String,
      enum: ['S1', 'S2'],
      required: true,
    },
    note: {
      type: Number,
      required: true,
    },
    surCombien: {
      type: Number,
      required: true,
    },
    poids: {
      type: Number,
      required: true,
    },
    dateEvaluation: {
      type: Date,
      required: true,
    },
    anneeAcademiqueId: {
      type: mongoose.Schema.ObjectId,
      ref: 'AnneeAcademique',
      required: true,
    },
    courId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Cour',
      required: true,
    },
    studentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
      required: true,
    },

    createdAt: {
      type: Date,
      default: Date.now(),
    },
  },
  {
    toJSON: { virtuals: true },
    toObject: { virtuals: true },
  }
);
evaluationSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'courId',
    select: 'nom semestre',
  }).populate({
    path: 'studentId',
    select: 'matricule nom prenom email',
  });
  next();
});
const Evaluation = mongoose.model('Evaluation', evaluationSchema);
module.exports = Evaluation;
