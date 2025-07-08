const mongoose = require('mongoose');
const bulletinSchema = new mongoose.Schema(
  {
    moyenne: {
      type: Number,
      required: true,
    },
    rang: {
      type: Number,
      required: true,
    },
    mention: {
      type: String,
      required: true,
    },
    decision: {
      type: String,
      required: true,
    },
    semestre: {
      type: String,
      enum: ['S1', 'S2'],
      required: true,
    },
    anneeAcademiqueId: {
      type: mongoose.Schema.ObjectId,
      ref: 'AnneeAcademique',
      required: true,
    },
    classeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Classe',
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
const Bulletin = mongoose.model('Bulletin', bulletinSchema);
module.exports = Bulletin;
