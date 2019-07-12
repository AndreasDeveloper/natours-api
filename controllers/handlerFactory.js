// Importing Utilities
const APIFeatures = require('../utils/apiFeatures');
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');


// Factory Function - For getting all documents
exports.getAll = Model => catchAsync(async (req, res, next) => {
    // Allow nested GET Reviews on tour routes
    let filter = {};
    if (req.params.tourId) filter = { tour: req.params.tourId };
    // Execute query
    const features = new APIFeatures(Model.find(filter), req.query).filter().sort().limitFields().pagination();
    const doc = await features.query;

    // Sending Status & JSON
    res.status(200).json({
        status: 'success',
        results: doc.length,
        data: {
            doc
        }
    });
});


// Factory Function - For getting one document
exports.getOne = (Model, populateOpt) => catchAsync(async (req, res, next) => {
    // Getting Tour by ID & Populating if populateOpt exists
    let query = Model.findById(req.params.id);
    if (populateOpt) query = query.populate(populateOpt);
    const doc = await query;

    // If doc doesn't exists, send error
     if (!doc) {
        return next(new AppError('No document found with given ID', 404));
    }

    // Sending Status & JSON
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});


// Factory Funtion - For creating documents
exports.createOne = Model => catchAsync(async (req, res, next) => {
    // Creating new Tour
    const doc = await Model.create(req.body);
        
    // Sending Status & JSON
    res.status(201).json({ // 201 - Writen Content
        status: 'success', 
        data: {
            doc
        }
    });
});


// Factory Function - For updating documents
exports.updateOne = Model => catchAsync(async (req, res, next) => {
    // Update Tour
    const doc = await Model.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // new - returns updated document
    // If tour doesn't exists, send error
    if (!doc) {
        return next(new AppError('No document found with given ID', 404));
    }

    // Sending JSON
    res.status(200).json({
        status: 'success',
        data: {
            doc
        }
    });
});


// Factory Function - For deleting documents
exports.deleteOne = Model => catchAsync(async (req, res, next) => {
    // Delete Tour
    const doc = await Model.findByIdAndDelete(req.params.id);
    // If tour doesn't exists, send error
    if (!doc) {
        return next(new AppError('No document found with given ID', 404));
    }
   
    // Sending JSON
    res.status(204).json({ // 204 - No Content
        status: 'success',
        data: null
    });
});