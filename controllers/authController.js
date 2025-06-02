const jwt = require('jsonwebtoken');
const compteurMatricule = require('./../models/compteurMatriculeModel');
const catchAsync = require('../utils/catchAsync');
const User = require('../models/userModels');

exports.signup = catchAsync(async(req, res) =>{
    const newUser = await User.create(req.body)
    const token = jwt.sign({id:newUser._id}, process.env.JWT_SECRET, {
            expiresIn:process.env.JWT_EXPIRES_IN
         });
         res.status(201).json({
            token,
            data:{user:newUser}
         })
})