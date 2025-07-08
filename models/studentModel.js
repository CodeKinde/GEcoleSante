const mongoose = require('mongoose');
const validator = require('validator');
const StudentSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    phone: {
      type: String,
      required: true,
      unique: true,
    },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      validate: [
        validator.isEmail,
        'Veuillez fournir une adresse e-mail valide!',
      ],
    },
    adresse: {
      type: String,
    },

    matricule: {
      type: String,
      unique: true,
      required: true,
    },
    dateNaissance: {
      type: Date,
      required: true,
    },
    lieuNaissance: {
      type: String,
    },
    dateInscription: {
      type: Date,
      default: Date.now(),
    },
    sexe: {
      type: String,
      enum: ['homme', 'femme'],
      required: true,
    },
    nationalite: {
      type: String,
    },

    statuts: {
      type: String,
      enum: ['inscrit', 'enAttente', 'suspendu', 'abandon', 'diplomé'],
      default: 'inscrit',
    },
    photo: String,
    classeId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Classe',
      required: true,
    },
    anneeAcademiqueId: {
      type: mongoose.Schema.ObjectId,
      ref: 'AnneeAcademique',
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
StudentSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'anneeAcademiqueId',
    select: 'nom',
  }).populate({
    path: 'classeId',
    select: 'nom niveau',
  });
  next();
});
const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;
