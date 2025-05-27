const mongoose = require('mongoose');

const etablissementSchema = new mongoose.Schema({
 nom: { 
    type: String, 
    required: true
 },
  type: { 
    type: String, 
    enum: ["public", "privé"], 
    default: "privé"
 },
  responsable: {
     type: String 
    },
  adresse: {
     type: String
     },
  ville: {
     type: String
     },
  telephone: { 
    type: String 
},
  email: {
     type: String,
     
     },
  logo: {
     type: String 
    },
     site_web: {
         type: String
         },
  actif: {
     type: Boolean, 
     default: true
     },
     
  createdAt: {
    type: Date,
    default: Date.now
  }
});
const Etablissement = mongoose.model('Etablissement', etablissementSchema);
module.exports = Etablissement;
