const mongoose = require('mongoose')
const anneeAcademiqueSchema = new mongoose.Schema({
    years:{
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
const AnneeAcademique = mongoose.model('AnneeAcademique', anneeAcademiqueSchema);
module.exports = AnneeAcademique;
