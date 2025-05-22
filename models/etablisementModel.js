const mongoose = require('mongoose')
const etablisementSchema = new mongoose.Schema({
    name:{
        type:String,
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
})
const Etablisement = mongoose.model('Etablisement', etablisementSchema);
module.exports = Etablisement;
