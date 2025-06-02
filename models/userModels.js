const mongoose = require('mongoose');
const validator= require('validator');
const bcrypt = require('bcrypt');
const userSchema = new mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    phone:{
        type:Number,
        required:true,
        unique:true
    },
    sexe:{
        type:String,
        enum:['H', 'F'],
        required:true
    },
    email:{
        type:String,
        required:true,
        unique:true,
        lowercase:true,
        validate:[validator.isEmail, "Veuillez fournir une adresse e-mail valide!"]
    },
    adresse:{
        type:String,
    },
    password:{
        type:String,
        required:true
    },

    passwordConfirm:{
        type:String,
        required:true,
        validate:{
            validator:function(el){
                return el === this.password;
            },
            message: "Les mots de passe ne sont pas les mêmes!"
        }
    },

    role:{
        type:String,
        enum:['admin', 'etudiant','enseignant','secrétaire'],
    },
    active:{
        type:Boolean,
        default:true
    },
    createdAt:{
        type:Date,
        default:Date.now()
    }
},{
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})
 userSchema.pre('save', async function(next){
    if(!this.isModified('password')) return next();
    this.password = await bcrypt.hash(this.password, 12);
 })
const Users = mongoose.model('User', userSchema);
module.exports = Users;