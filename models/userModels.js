const mongoose = require('mongoose');
const validator= require('validator');
const userSchema = new mongoose.Schema({
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
  
    sexe:{
        type:String,
        enum:['H', 'F'],
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, "Please provide a valid email"]
    },
    adresse:{
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

    role:{
        type:String,
        enum:['admin', 'etudiant','enseignant','secretaire'],
    },
    active:{
        type:Boolean,
        default:true
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