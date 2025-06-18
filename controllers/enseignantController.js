const Factory = require('./handlerFactory');
const Enseignant = require('./../models/enseignantModel');
const catchAsync = require('../utils/catchAsync');
const mongoose = require('mongoose')
exports.getAllEnseignant = catchAsync(async(req, res) =>{

    const enseignants = await Enseignant.aggregate([
        
        {
            $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"user"
            },
        },
         {$unwind:"$user"},
         {
            $lookup:{
                from:"filieres",
                localField:'specialiteId',
                foreignField:"_id",
                as:"specialite"
            }
         },
         {

         },
         {$unwind:'$specialite'},
         {
            $project:{
                _id:1,
                nom:'$user.name',
                Télephone:"$user.phone",
                email:"$user.email",
                titre:1,
                grade:1,
                address:1,
                filière:"$specialite.code",
            }
         },
         
         {$sort:{nom:1}}
    ]);
    console.log(enseignants);
    
    res.status(200).json({
        status:"Success",
        data:enseignants
    }) 
})

exports.getEnseignant = catchAsync(async(req, res) =>{
    const enseignantId = new mongoose.Types.ObjectId(req.params.enseignantId);
    const enseignants = await Enseignant.aggregate([
        //trouver lenseignantId
        {
            $match:{_id:{enseignantId}}
        },
        {
            $lookup:{
                from:"users",
                localField:"userId",
                foreignField:"_id",
                as:"user"
            },
        },
         {$unwind:"$user"},
         {
            $lookup:{
                from:"filieres",
                localField:'filiereId',
                foreignField:"_id",
                as:"filiere"
            }
         },
         {$unwind:'$filiere'},
         
        // $lookup:{
        //     from:"classes",
        //     let:{enseignantFilieres:'$filiereId'},
        //     pipeline:[
        //         {
        //         $match:{
        //         $expr:{
        //             $in:['$filiereId', '$$enseignantFilieres']
        //         }
        //         },
        //         },
        //     ],
        //     as:'classe'

        //  }
        {
            $lookup: {
            from: 'classes',
            localField: 'filiereId',
            foreignField: 'filiereId',
            as: 'classe'
            }
         },
         {
            $project:{
                _id:1,
                nom:'$user.name',
                Télephone:"$user.phone",
                email:"$user.email",
                titre:1,
                grade:1,
                address:1,
                filière:"$filiere.code",
                classe:'$classe.nom'
            }
         },
         
         {$sort:{nom:1}}
    ]);
    console.log(enseignants);
    
    res.status(200).json({
        status:"Success",
        data:enseignants
    }) 
})
exports.createEnseignant = Factory.createOne(Enseignant);


exports.updateEnseignant = Factory.updateOne(Enseignant);
exports.deleteEnseignant = Factory.deleteOne(Enseignant);
