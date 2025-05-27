const mongoose = require('mongoose')
const filiereSchema = new mongoose.Schema({
    nom:{
        type:String,
        unique:true,
        required:true
    },
    code:{
        type:String,
        required:true,
    },
     duree:{
        type:String,
        required:true
    },
     description:{
        type:String,
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
const Filiere = mongoose.model('Filiere', filiereSchema);
module.exports = Filiere;
