// Importing Models
const Tour = require('../models/tourModel');

// Reading Tours JSON Data
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// Handler Functions for TOURS
// Middleware for query manipulation, aliasing
exports.aliasTopTours = (req, res, next) => {
    req.query.limit = '5';
    req.query.sort = '-ratingsAverage,price';
    req.query.fields = 'name,price,ratingsAverage,summary,difficulty';
    next();
};

// GET - All Tours
exports.getAllTours = async (req, res) => {
    try {
        // Query Manipulation - Destructuring query object, excluding fields | FILTERING
        const queryObj = {...req.query}; // rest paramter will take all of the fields from req.query and create new object as it was encapsulated with {}
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]); // Deleting fields (keys) from query Object
        // Query Manipulation - Replacing logical operators from query | ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Getting All Tours || Filtering / Querying using mongoose or req.query > Build Query
        let query = Tour.find(JSON.parse(queryStr)); //.where('duration').equals(5).where('difficulty').equals('easy');

        // Sorting
        if (req.query.sort) {
            const sortBy = req.query.sort.split(',').join(' ');
            query = query.sort(sortBy);
        } else { // Default sort
            query = query.sort('-ratingsAverage');
        }

        // Field Limiting - fields=
        if (req.query.fields) { 
            const fields = req.query.fields.split(',').join(' '); // exclude commas, join by empty spaces to get a full string
            query = query.select(fields);
        } else { // Default fields
            query = query.select('-__v'); // - (minus) presents excluding
        }

        // Pagination
        const page = req.query.page * 1 || 1; // converting string to number. default is 1
        const limit = req.query.limit * 1 || 100; // Results per page
        const skip = (page - 1) * limit; // page - 1 = previous page * limit
        // Skipping and Limiting
        query = query.skip(skip).limit(limit);
        // Count document and check if page doesn't exists
        if (req.query.page) {
            const numTours = await Tour.countDocuments(); // Count tours - total number of tours
            if (skip >= numTours) throw new Error('This page does not exist');
        }

        // Execute query
        const allTours = await query;

        // Sending Status & JSON
        res.status(200).json({
            status: 'success',
            results: allTours.length,
            data: {
                allTours
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

// GET - Specific Tour
exports.getTour = async (req, res) => {
    try {
        // Getting Tour by ID
        const tour = await Tour.findById(req.params.id);
        // Sending Status & JSON
        res.status(200).json({
            status: 'success',
            data: {
                tour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

// POST - New Tour
exports.createTour = async (req, res) => {
    try {
        // Creating new Tour
        const newTour = await Tour.create(req.body);
        
        // Sending Status & JSON
        res.status(201).json({ // 201 - Writen Content
            status: 'success', 
            data: {
                tour: newTour
            }
        });
    } catch (err) {
        res.status(400).json({ // 400 - Bad Request
            status: 'fail',
            message: err
        });
    }
};

// PATCH - Specific Tour
exports.updateTour = async (req, res) => {
    try {
        // Update Tour
        const updatedTour = await Tour.findByIdAndUpdate(req.params.id, req.body, { new: true, runValidators: true }); // new - returns updated document

        // Sending JSON
        res.status(200).json({
            status: 'success',
            data: {
                updatedTour
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

// DELETE - Specific Tour
exports.deleteTour = async (req, res) => {
    try {
        // Delete Tour
        await Tour.findByIdAndDelete(req.params.id);

        // Sending JSON
        res.status(204).json({ // 204 - No Content
            status: 'success',
            data: null
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};