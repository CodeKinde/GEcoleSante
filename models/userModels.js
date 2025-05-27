const mongoose = require('mongoose')
const userSchema = new mongoose.Schema({
    matricule:{
        type:String,
        unique:true,
        default:"none"
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
    email:{
        type:String,
        required:true,
        unique:true
    },
    
    adresse:{
        type:String,
    },
    nationalite:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },

    passwordConfirm:{
        type:String,
        required:true
    },
    
    statuts: {
    type: String,
    enum: ["inscrit", "redoublant", "retrait", "diplômé"],
    default: "inscrit"
    },

    role:{
        type:String,
        enum:['admin', 'etudiant','enseignant'],
    },
    active:{
        type:Boolean,
        default:true
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
const Users = mongoose.model('User', userSchema);
module.exports = Users;