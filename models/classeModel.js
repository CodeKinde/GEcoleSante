const mongoose = require('mongoose')
const classeSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    anneeAcademiqueId:{
        type:mongoose.Schema.ObjectId,
        ref:"Classe",
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
