const mongoose = require('mongoose')
const anneeAcademiqueSchema = new mongoose.Schema({
    name:{
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
const AnneeAcademiqueSchema = mongoose.model('AnneeAcademiqueSchema', anneeAcademiqueSchema);
module.exports = AnneeAcademiqueSchema;
