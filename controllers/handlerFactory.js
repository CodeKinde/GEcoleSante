const catchAsync = require('./../utils/catchAsync')
const AppError = require('./../utils/appError')

exports.getAll = (Model) => catchAsync(async(req, res, next) =>{
    const doc = await Model.find(req.body);
    res.status(200).json({
        status:"Success", 
        result:doc.lenght,
        data:doc
    });
});

exports.createOne = (Model) => catchAsync(async(req, res, next) =>{
    const doc = await Model.create(req.body);
    res.status(201).json({
        status:"success",
        data:doc
    });
});

exports.getOne = (Model) => catchAsync(async(req, res, next) =>{
    const doc = await Model.findById(req.params.id);
    if(!doc){
        return next(new AppError('No Document found with that ID', 404))
    }
    res.status(200).json({
        status:"Success",
        data:doc
    });
});

exports.updateOne = (Model) => catchAsync(async(req, res, next) =>{
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body);
    if(!doc){
        return next(new AppError('No Document found with that ID', 404))
    }
    res.status(200).json({
        status:"Success",
        data:doc
    })
})

exports.deleteOne = (Model) => catchAsync(async(req, res, next) =>{
    const doc = await Model.findByIdAndDelete(req.params.id);
     if(!doc){
        return next(new AppError('No Document found with that ID', 404))
    }
    res.status(204).json({
        status:"Success",
        data:null
    })
})