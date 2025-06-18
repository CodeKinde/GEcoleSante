const Factory = require('./handlerFactory');
const Etudiant = require('./../models/studentModel');
const User = require('./../models/userModels')
const mongoose = require('mongoose')
const catchAsync = require('../utils/catchAsync');

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
            annee:"$year.nom"
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


exports.getEtudiantByFiliere = catchAsync(async(req, res) =>{
const filiereId = new mongoose.Types.ObjectId(req.params.filiereId);
    
    const etudiantbyFiliere = await Etudiant.aggregate([
       
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
     //jointure par Filiere
      {
         $lookup:{
            from:"filieres",
            localField:"classe.filiereId",
            foreignField:"_id",
            as:"filiere"
        }
     },
     {$unwind:'$filiere'},
      {
            $match:{
                'filiere._id': filiereId,
            },

        },
     {
        $group:{
                _id:"$filiere._id",
                Filière:{$first:"$filiere.nom"}, 
                Code:{$first:"$filiere.code"},            
                etudiants:{
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
     {$sort:{name:-1}}

    ]);
    
    res.status(200).json({
        status:"Success",
        results:etudiantbyFiliere.length,
        data:etudiantbyFiliere
    });
})


exports.getAllEtudiants = catchAsync(async(req, res) =>{
    const filters = [];
    if(req.query.classeId){
        filters.push({
            classeId:new mongoose.Types.ObjectId(req.query.classeId)
        })
    }
    if(req.query.anneeAcademiqueId){
        filters.push({
            anneeAcademiqueId:new mongoose.Types.ObjectId(req.query.anneeAcademiqueId)
        })
    }

    if(req.query.sexe){
        filters.push({sexe:req.query.sexe})
    }

    const search = req.query.search;
    const page = parseInt(req.query.page || 1);
    const limit = parseInt(req.query.limit || 10);
    const skip = (page -1) * limit;
    console.log(search);
    
    const etudiants =  await Etudiant.aggregate([
        {
            $lookup:{
                from:'users',
                localField:'userId',
                foreignField:'_id',
                as:'user'
            },
        },
         {$unwind:'$user'},

         {
            $lookup:{
                from:'classes',
                localField:'classeId',
                foreignField:'_id',
                as:'classe'
            },
        },
         {$unwind:'$classe'},

         {
            $lookup:{
                from:"filieres",
                localField:"classe.filiereId",
                foreignField:"_id",
                as:'filiere'
            },
         },
         {$unwind:"$filiere"},

         {
            $lookup:{
                from:'anneeAcademiques',
                localField:'anneeAcademiqueId',
                foreignField:'_id',
                as:'year'
            },
        },
        {$unwind:'$year'},
         // Recherche par nom/prenom/matricule
     ...(search ?
        [{
            $match:{
                $or:[
                    {'user.name':{$regex:search, $options:'i'}},
                    {matricule:{$regex:search, $options:'i'}}
                ]
            }

        }] 

     :[]),
     ...(filters.length ? [{$match:{$and:filters}}]: []),
    {
    $project: {
      _id: 1,
      matricule: 1,
      nom: '$user.name',
      Télephone:'$user.phone',
      email: '$user.email',
      dateInscription:1,
      dateNaissance:1,
      lieuNaissance:1,
      nationalite:1,
      statut:1,
      active:"$user.active",
      sexe: 1,
      addresse:'$user.address',
      classe: '$classe.nom',
      niveau: '$classe.niveau',
      filiere:'$filiere.nom',
      Année:'$year.nom'
    }
   },
   {$sort:{name:1}},
   {$skip: skip},
   {$limit: limit}
 ]);
 const total = await Etudiant.countDocuments(filters);
 res.status(200).json({
    status:"Success",
    total,
    results:etudiants.length,
    page:parseInt(page),
    pages:Math.ceil(total/ limit),
    data:etudiants
 });
});

