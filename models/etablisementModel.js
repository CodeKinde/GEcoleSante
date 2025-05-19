const mongoose = require('mongoose')
const etablisementSchema = new mongoose.Schema({
    name:{
        type:String,
        unique:true,
        required:true
    },
    anneeAcademiqueId:{
        type:String,
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
