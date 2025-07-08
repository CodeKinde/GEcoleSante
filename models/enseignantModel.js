const mongoose = require('mongoose');
const validator = require('validator');
const enseignantSchema = new mongoose.Schema(
  {
    nom: {
      type: String,
      required: true,
    },
    prenom: {
      type: String,
      required: true,
    },
    titre: {
      type: String,
    },
    grade: {
      type: String,
    },
    phone: {
      type: Number,
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
    adress: {
      type: String,
    },
    sexe: {
      type: String,
      enum: ['homme', 'femme'],
      required: true,
    },
    specialites: [String],
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
const Enseignant = mongoose.model('Enseignant', enseignantSchema);
module.exports = Enseignant;
