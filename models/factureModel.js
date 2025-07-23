const mongoose = require('mongoose');
const factureSchema = new mongoose.Schema(
  {
    etudiantId: {
      type: mongoose.Schema.ObjectId,
      ref: 'Student',
      required: true,
      index: true,
    },
    type: {
      type: String,
      enum: ['inscription', 'mensualité', 'examen', 'soutenance'],
      required: true,
    },
    mois: {
      type: String,
      enum: [
        'Janvier',
        'Février',
        'Mars',
        'Avril',
        'Mai',
        'Juin',
        'Juillet',
        'Août',
        'Septembre',
        'Octobre',
        'Novembre',
        'Décembre',
      ],
      required: function () {
        return this.type === 'mensualité';
      },
    }, // Pour mensualité uniquement
    anneeAcademiqueId: {
      type: mongoose.Schema.ObjectId,
      ref: 'AnneeAcademique',
      required: true,
      index: true,
    },
    montantTotal: {
      type: Number,
      required: true,
    },
    montantPaye: {
      type: Number,
      default: 0,
    },
    statut: {
      type: String,
      enum: ['payée', 'partielle', 'impayée'],
      default: 'impayée',
    },
    dateEcheance: {
      type: Date,
    },
    paiements: [
      {
        type: mongoose.Schema.ObjectId,
        ref: 'Paiement',
      },
    ],
    createdAt: {
      type: Date,
      default: Date.now,
    },
  },
  { toJSON: { virtuals: true }, toObject: { virtuals: true } }
);
//Reste à payer caculé dynamiquement
factureSchema.virtual('resteAPayer').get(function () {
  return Math.max(this.montantTotal - this.montantPaye, 0);
});
// mise à jour automatique le statut
factureSchema.pre('save', function (next) {
  if (this.montantPaye >= this.montantTotal) {
    this.statut = 'payée';
  } else if (this.montantPaye > 0) {
    this.statut = 'partielle';
  } else {
    this.statut = 'impayée';
  }
  next();
});

factureSchema.pre(/^find/, function (next) {
  this.populate({
    path: 'etudiantId',
    select: 'nom prenom sexe phone email address',
  }).populate({
    path: 'AnneeAcademique',
    select: '-__v',
  });
  next();
});
const Facture = mongoose.model('Facture', factureSchema);
module.exports = Facture;
