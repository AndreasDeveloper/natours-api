// Importing Models
const Tour = require('../models/tourModel');
// Importing Utilities
const APIFeatures = require('../utils/apiFeatures');

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
        // Execute query
        const features = new APIFeatures(Tour.find(), req.query).filter().sort().limitFields().pagination();
        const allTours = await features.query;

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

// GET - Tour Statistics
exports.getTourStats = async (req, res) => {
    try {
        // Aggregation Pipeline with MDB
        const stats = await Tour.aggregate([
            {
                $match: { ratingsAverage: { $gte: 4.5 } } // Match tours with rating of 4.5 or greater
            },
            {
                $group: { 
                    _id: { $toUpper: '$difficulty'}, // Group documents (tours) by difficulty
                    numTours: { $sum: 1 }, // total tours
                    numRatings: { $sum: '$ratingsQuantity' }, // total ratings
                    avgRating: { $avg: '$ratingsAverage' }, // Average rating
                    avgPrice: { $avg: '$price' }, // Average price
                    minPrice: { $min: '$price' }, // Minimum tour price
                    maxPrice: { $max: '$price' }, // Maximum tour price
                }
            },
            {
                $sort: { avgPrice: 1 } // Sort by average price (1 - asscending)
            },
            // {
            //     $match: { _id: { $ne: 'EASY' } } // Repeating match, excluding easy tours ($ne - not equal)
            // }
        ]);
        // Sending Status & JSON
        res.status(200).json({ // 204 - No Content
            status: 'success',
            data: {
                stats
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};

exports.getMonthlyPlan = async (req, res) => {
    try {
        const year = req.params.year * 1; 
        // Aggregation Pipeline with MDB
        const plan = await Tour.aggregate([
            {
                $unwind: '$startDates' // - Unwind deconstructs an array field from input documents and then output one doc for each element of an array (startDates)
            },
            {
                $match: { startDates: { $gte: new Date(`${year}-01-01`), $lte: new Date(`${year}-12-31`) } } // Get 12 months of given year
            },
            {
                $group: { // Group by start dates
                    _id: { $month: '$startDates' },
                    numTourStarts: { $sum: 1 },
                    tours: { $push: '$name' }
                }
            },
            { 
                $addFields: { month: '$_id' } // add month field with a value of _id
            },
            {
                $project: { _id: 0 } // Make _id field invisible
            },
            {
                $sort: { numTourStarts: -1 } // Sort in descending order
            },
            // {
            //     $limit: 12 // limit the outputs
            // }
        ]);
        // Sending Status & JSON
        res.status(200).json({ // 204 - No Content
            status: 'success',
            results: plan.length,
            data: {
                plan
            }
        });
    } catch (err) {
        res.status(404).json({
            status: 'fail',
            message: err
        });
    }
};