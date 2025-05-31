const mongoose = require("mongoose");
const compteurMatriculeSchema = new mongoose.Schema({
    // model le matricule avec compteur par année
     annee: {
        type: String,
        required: true,
        unique: true
     },
     
    compteur: {
     type: Number,
     default: 0 
    }
});
const compteurMatricule = mongoose.model('compteurMatricule', compteurMatriculeSchema);
module.exports = compteurMatricule;