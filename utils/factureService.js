const Facture = require('./../models/factureModel');
const Student = require('./../models/enseignantModel');
const AnneeAcademique = require('./../models/anneeAcademiqueModel');
const Paiement = require('./../models/paiementModel');
async function createFactureService(data) {
  const {
    studentId,
    anneeAcademiqueId,
    type,
    mois,
    montantTotal,
    dateEcheance,
  } = data;
  // Vérifier si l'étudiant existe
  const student = await Student.findById(studentId);
  if (!student) throw new Error('Etudiant introuvable.');
  // Vérifier si année academique existe
  const anneeAcademique = await AnneeAcademique.findById(anneeAcademiqueId);
  if (!anneeAcademique) throw new Error('année academique introuvable');
  // creer facture
  const facture = new Facture({
    studentId,
    anneeAcademiqueId,
    type,
    mois: type === 'mensualité' ? mois : undefined,
    montantTotal,
    dateEcheance,
    montantPaye: 0,
    statut: 'impayée',
  });
  facture.save();
  return facture;
}

module.exports = createFactureService;
