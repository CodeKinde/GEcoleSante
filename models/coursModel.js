const mongoose = require('mongoose')
const courSchema = new mongoose.Schema({
    titre:{
        type:String,
        required:true
    },
    code:{
        type:String,
        unique:true,
        required:true
    },

    volume_horaire:{
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
    enseignant_id:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    
     classe_id:{
        type:mongoose.Schema.ObjectId,
        ref:"Classe",
        required:true,
    },
    anneeAcademique:{
        type:String
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
