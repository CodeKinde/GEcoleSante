const mongoose = require('mongoose');
const validator= require('validator');
const StudentSchema = new mongoose.Schema({
    matricule:{
        type:String,
        unique:true,
        required:true
    },
    nom:{
        type:String,
        required:true
    },
    prenom:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    dateNaissance:{
        type:Date,
        required:true
    },
    lieuNaissance:{
        type:Date,
    },
    dateInscription:{
        type:Date,
        default:Date.now()
    },
    sexe:{
        type:String,
        enum:['Homme', 'Femme'],
        required:true
    },
    
    adresse:{
        type:String,
    },
    nationalite:{
        type:String,
    },
    
    statuts: {
    type: String,
    enum: ["inscrit", "redoublant", "retrait", "diplômé"],
    default: "inscrit"
    },

    classeId:{
        type:mongoose.Schema.ObjectId,
        ref:"Classe",
        required:true
    },
    photo:String,
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;