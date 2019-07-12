// Importing Models
const Tour = require('../models/tourModel');
// Importing Utilities
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// Importing Controllers
const factory = require('./handlerFactory');

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
exports.getAllTours = factory.getAll(Tour);

// GET - Specific Tour
exports.getTour = factory.getOne(Tour, { path: 'reviews' }); // Model & populate options as args

// POST - New Tour
exports.createTour = factory.createOne(Tour);

// PATCH - Specific Tour
exports.updateTour = factory.updateOne(Tour);

// DELETE - Specific Tour
exports.deleteTour = factory.deleteOne(Tour);


// GET - Tour Statistics
exports.getTourStats = catchAsync(async (req, res, next) => {
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
});

// GET - Monthly Tour Statistics
exports.getMonthlyPlan = catchAsync(async (req, res, next) => {
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
});

// GET - Tours within Radius | Geospatial
exports.getToursWithin = catchAsync(async (req, res, next) => {
    // Declaring Variables
    const { distance, latlng, unit } = req.params;
    const [lat, lng] = latlng.split(','); 
    const radius = unit === 'mi' ? distance / 3963.2 : distance / 6378.1; // 3963.2 = Earth radius in Miles. 6378.1 = Earth radius in Kilometers

    // Check if lat and lng exists
    if (!lat || !lng) {
        next(new AppError('Provide lantitude and longitude in the format: lat, lng', 400));
    }

    // Querying for geospatial locations
    const tours = await Tour.find({ startLocation: { $geoWithin: { $centerSphere: [[ lng, lat ], radius] } } });

    // Sending Status & JSON
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});