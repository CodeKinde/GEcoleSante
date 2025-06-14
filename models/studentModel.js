const mongoose = require('mongoose');
const validator= require('validator');
const StudentSchema = new mongoose.Schema({
    matricule:{
        type:String,
        unique:true,
        required:true
    },
    dateNaissance:{
        type:Date,
        required:true
    },
    lieuNaissance:{
        type:String,
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
    nationalite:{
        type:String,
    },
    
    statuts: {
    type: String,
    enum: ["inscrit", "en_attente", "suspendu", "abandon", "diplomé"],
    default: "inscrit"
    },
    userId:{
         type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true
    },

    classeId:{
        type:mongoose.Schema.ObjectId,
        ref:"Classe",
        required:true
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
});
StudentSchema.pre(/^find/, function(next){
    this.populate({
        path:"userId",
        select:"name email addresse phone"
    }).populate({
        path:"anneeAcademiqueId",
        select:"years"
    }).populate({
        path:"classeId",
        select:"nom niveau"
    });
    next()
});
const Student = mongoose.model('Student', StudentSchema);
module.exports = Student;