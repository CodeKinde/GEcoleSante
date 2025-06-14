const Factory = require('./handlerFactory');
const Etudiant = require('./../models/studentModel');
const User = require('./../models/userModels')
const mongoose = require('mongoose')
const catchAsync = require('../utils/catchAsync');
exports.getAllEtudiants = catchAsync(async(req, res, next) =>{
    //BUILD QUERY
    const queryObj = {...req.query}
    const excludedFields = ['page', 'sort', 'limit', 'fields'];
    excludedFields.forEach(el => delete queryObj[el]);
    // 2) Advance filtering
    let queryStr = JSON.stringify(queryObj)
    queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);
    const query =  Etudiant.find(JSON.parse(queryStr));
    //Sorting
    // if(!req.query.sort){
    //     const sortBy = req.query.sort.split(',').join(' '); 
    // }
    const etudiants = await query
    res.status(200).json({
        status:"Success",
        results:etudiants.length,
        data:etudiants
    })
    
});
exports.getEtudiant = Factory.getOne(Etudiant);
exports.createEtudiant = catchAsync(async (req, res, next) =>{
    const {
        userId,
        anneeAcademiqueId,
        classeId,
        matricule,
        dateNaissance,
        lieuNaissance,
        dateInscription,
        sexe,
        nationalite,
        statuts,
    } = req.body;

    const etudiant = new Etudiant({
        userId,
        anneeAcademiqueId,
        classeId,
        matricule,
        dateNaissance,
        lieuNaissance,
        dateInscription,
        sexe,
        nationalite,
        statuts,
    });
    const savedEtudiants = await etudiant.save();
    res.status(201).json({
        status:"Success",
        data:savedEtudiants
    });
    
}) 

exports.getEtudiantByClasse = catchAsync(async(req, res) =>{
const classeId = new mongoose.Types.ObjectId(req.params.classeId);
    console.log(classeId);
    
    const studentbyClasses = await Etudiant.aggregate([
        {
            $match:{
                classeId: classeId,
            },

        },
        {
        //jointure par utilisateur
        $lookup:{
            from:"users",
            localField:"userId",
            foreignField:"_id",
            as:"user"
        }
     },
     {$unwind:'$user'},
     //jointure par classe
     {
         $lookup:{
            from:"classes",
            localField:"classeId",
            foreignField:"_id",
            as:"classe"
        }
     },
     {$unwind:'$classe'},
     //jointure par année
      {
         $lookup:{
            from:"anneeAcademiques",
            localField:"anneeAcademiqueId",
            foreignField:"_id",
            as:"year"
        }
     },
     {$unwind:'$year'},
     {
        $project:{
            _id:1,
            matricule:1,
            name:"$user.name",
            email:"$user.email",
            télephone:"$user.phone",
            sexe:1,
            classe:"$classe.nom",
            niveau:"$classe.niveau",
            dateInscription:1,
            annee:"$year.years"
        }
     },
     {$sort:{name:-1}}

    ]);
    
    res.status(200).json({
        status:"Success",
        results:studentbyClasses.length,
        data:studentbyClasses
    });
})

exports.getEtudiantByAcademicYear = catchAsync(async(req, res) =>{
    const etudiantByYears = await Etudiant.aggregate([
         {
            //jointure avec utilisateur
            $lookup:{
                from:'users',
                localField:"userId",
                foreignField:"_id",
                as:"user"
            },
        },
        {$unwind:"$user"},
        {
            //jointure avec classe
            $lookup:{
                from:'classes',
                localField:"classeId",
                foreignField:"_id",
                as:"classe"
            },
        },
        {$unwind:"$classe"},
        //Jointure avec année
        {
            $lookup:{
                from:"anneeAcademiques",
                localField:"anneeAcademiqueId",
                foreignField:'_id',
                as:"year"
            }
        },
        {$unwind:"$year"},
        {
            //Groupée par annee
            $group:{
                _id:"$year._id",
                année:{$first:"$year.years"},              
                etudiant:{
                    $push:{
                    name:"$user.name",
                    email:"$user.email",
                    Télephone:"$user.phone",
                    matricule:'$matricule',
                    classe:"$classe.nom",
                    sexe:'$sexe',
                }
                }
            }

        },
        {$sort:{dateInscription: -1}}
    ]);
    res.status(200).json({
        status:"200",
        data:etudiantByYears
    })
})
