const mongoose = require('mongoose');

const etablissementSchema = new mongoose.Schema({
  nom: {
    type: String,
    required: true,
    trim: true
  },
  adresse: {
    type: String,
    required: true
  },
  telephone: {
    type: String
  },
  email: {
    type: String
  },
  responsable: {
    type: String
  },
  type: {
    type: String, // exemple : "université", "école de santé", etc.
    enum: ['université', 'école de santé', 'centre de formation'],
    required: true
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Etablissement', etablissementSchema);
