const mongoose = require('mongoose');
const paiementSchema = new mongoose.Schema(
  {
    categoriePaiement: {
      type: String,
      enum: ['inscription', 'mensualité', 'examen', 'soutenance'],
      required: true,
    },
    montant: {
      type: Number,
      required: true,
    },
    modePaiement: {
      type: String,
      enum: ['espèce', 'mobile_money', 'virement'],
      required: true,
    },
    reference: {
      type: String,
    },
    statut: {
      type: String,
      enum: ['payé', 'enAttente', 'annulé'],
      required: true,
    },
    description: {
      type: String,
      trim: true,
    },
    studentId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
      required: true,
    },

    datePaiement: {
      type: Date,
      default: Date.now, // ou laissé vide si on le fournit manuellement
    },
    createdBy: {
      type: mongoose.Schema.ObjectId,
      ref: 'User', // ou 'Admin' selon ta structure
      required: false,
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
// paiementSchema.virtual('resteApayeCalculé').get(function () {
//   return this.montantTotal - this.montantPaye;
// });
const Paiement = mongoose.model('Paiement', paiementSchema);
module.exports = Paiement;
