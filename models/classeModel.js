const mongoose = require('mongoose')
const classeSchema = new mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
     niveau:{
        type:String,
        required:true
    },
    anneeAcademiqueId:{
        type:mongoose.Schema.ObjectId,
        ref:"AnneeAcademique",
        required:true,
    },
    etablissementId:{
        type:mongoose.Schema.ObjectId,
        ref:"Etablissement",
        required:true,
    },
    
     filiereId:{
        type:mongoose.Schema.ObjectId,
        ref:"Filiere",
        required:true,
    },
    
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
const Classe = mongoose.model('Classe', classeSchema);
module.exports = Classe;
