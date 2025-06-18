const mongoose = require('mongoose')
const enseignantSchema = new mongoose.Schema({
    nom:{
    type:String,
    required:true
    },
    titre:{
        type:String,
    },
    grade:{
        type:String,
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, "Veuillez fournir une adresse e-mail valide!"]
    },
    adress:{
        type:String,
    },
    specialites:[String],
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
const Enseignant = mongoose.model('Enseignant', enseignantSchema);
module.exports = Enseignant;
