const mongoose = require('mongoose')
const enseignantSchema = new mongoose.Schema({
    titre:{
        type:String,
    },
    grade:{
        type:String,
    },
    userId:{
        type:mongoose.Schema.ObjectId,
        ref:"User",
        required:true,
    },
    specialiteId:[{
        type:mongoose.Schema.ObjectId,
        ref:"Filiere",
    }],
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
