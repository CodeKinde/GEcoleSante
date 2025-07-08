const mongoose = require('mongoose');
const Student = require('./studentModel');
const courSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    code: {
      type: String,
      unique: true,
      required: true,
    },
    volumeHoraire: {
      type: Number,
      required: true,
    },
    coefficient: {
      type: Number,
      required: true,
    },
    semestre: {
      type: String,
      enum: ['S1', 'S2'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    enseignantId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Enseignant',
      required: true,
    },

    classeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Classe',
      required: true,
    },
    programme: {
      type: String,
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
courSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'enseignantId',
    select: 'nom prenom specialite',
  });
  next();
});
const Cour = mongoose.model('Cour', courSchema);
module.exports = Cour;
