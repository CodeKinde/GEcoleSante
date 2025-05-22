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
    dateInscription:{
        type:Date,
        default:Date.now()
    },
    sex:{
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
        required:true
    },
    password:{
        type:String,
        required:true
    },

    passwordConfirm:{
        type:String,
        required:true
    },
    
    statut: {
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