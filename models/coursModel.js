const mongoose = require('mongoose')
const courSchema = new mongoose.Schema({
    nom:{
        type:String,
        required:true
    },
    code:{
        type:String,
        unique:true,
        required:true
    },
    volumeHoraire:{
        type:Number,
        required:true
    },
    coefficient:{
        type:Number,
        required:true
    },
     semestre:{
        type:Number,
        required:true
    },
     niveau:{
        type:Number,
        required:true
    },
    description:{
        type:String,
        trim:true
    },
    enseignantId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    
     classeId:{
        type:mongoose.Schema.ObjectId,
        ref:"Classe",
        required:true,
    },
    anneeAcademiqueId:{
        type:mongoose.Schema.ObjectId,
        ref:"AnneeAcademique",
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
const Cour = mongoose.model('Cour', courSchema);
module.exports = Cour;
