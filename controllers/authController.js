const jwt = require('jsonwebtoken');
const {promisify} = require('util');
const AppError = require('./../utils/appError');
const compteurMatricule = require('./../models/compteurMatriculeModel');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModels');

const signToken = id =>{
    return jwt.sign({id}, process.env.JWT_SECRET, {
            expiresIn:process.env.JWT_EXPIRES_IN
         });
}

exports.signup = catchAsync(async(req, res) =>{
    const newUser = await User.create(req.body);
    const token = signToken(newUser._id)
         res.status(201).json({
            token,
            data:{user:newUser}
         })
})

exports.login = catchAsync(async(req, res, next) =>{
    const {email, password} = req.body;
        // 1) Check if email and password exist
    if(!email || !password){
        return next(new AppError('Veuillez fournir votre adresse e-mail et votre mot de passe', 400));
    }
    //2) Check if user exists && password is correct
    const user = await User.findOne({email}).select('+password');
    if(!user || !(await user.correctPassord(password, user.password))){
        return next(new AppError('E-mail et mot de passe incorrects', 401))
    }
    //3) If everything ok, send token to client
    const token = signToken(user._id)
    res.status(200).json({
        status:"success",
        token
    });
});

exports.protect = catchAsync(async(req, res, next) =>{
    //1) Obtenir un jeton et vérifier qu'il est ici
    let token;
    if(req.headers.authorization && req.headers.authorization.startsWith('Bearer')){
        token = req.headers.authorization.split(' ')[1]; 
    }
    // console.log(token);
    if(!token){
        return next(new AppError("Vous n'êtes pas connecté ! Veuillez vous connecter pour accéder au site.", 401))
    }
    // 2) Verification token 
    const decoded = await promisify(jwt.verify)(token, process.env.JWT_SECRET);
    // console.log(decoded);
    
    // 3) Vérifier si l'utilisateur existe toujours
    const currentUser = await User.findById(decoded.id);
    if(!currentUser){
        return next(new AppError("L'utilisateur appartenant à ce jeton n'existe plus.", 401));
    }
    // 4) Vérifiez si l'utilisateur a changé de mot de passe après l'émission du jeton
    if(currentUser.changedPasswordAfter(decoded.iat)){
        return next(new AppError('User recently changed password! Please log in again!', 401))
    }
    //GRANT ACCESS TO PROTECTED ROUTE
    req.user = currentUser;
    next();
})

 exports.restricto = (...roles) =>{
    // roles["admin", "etudiant"] role=user
    return (req, res, next) =>{
      if(!roles.includes(req.user.role)){
        return next(new AppError('You do not have permission to perform this action',403))
    }  
    next();
    };
    
};