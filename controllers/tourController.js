// Importing Dependencies
const multer = require('multer');
const sharp = require('sharp');
// Importing Models
const Tour = require('../models/tourModel');
// Importing Utilities
const AppError = require('../utils/appError');
const catchAsync = require('../utils/catchAsync');
// Importing Controllers
const factory = require('./handlerFactory');

// Reading Tours JSON Data
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));


// --- Multer Setup --- \\
const multerStorage = multer.memoryStorage(); // Saving files to memory | buffer save

// Creating Multer Filter - Check if uplaoded file is image
const multerFilter = (req, file, cb) => {
    if (file.mimetype.startsWith('image')) {
        cb(null, true);
    } else {
        cb(new AppError('File is not a image type', 400), false);
    }
};

// Setting up Multer
const upload = multer({  // dest to save files in fs
    storage: multerStorage,
    fileFilter: multerFilter
});

// Middleware Function for uploading tour images
exports.uploadTourImages = upload.fields([
    { name: 'imageCover', maxCount: 1 },
    { name: 'images', maxCount: 3 }
]);
// Middleware Function for resizing tour images
exports.resizeTourImages = catchAsync(async (req, res, next) => {
    if (!req.files.imageCover || !req.files.images) return next();

    // Defining filenames || Inserting imageCoverFilename to body in order to update it
    req.body.imageCover = `tour-${req.params.id}-${Date.now()}-cover.jpeg`; 

    // Resizing Cover Image
    await sharp(req.files.imageCover[0].buffer)
        .resize(2000, 1333) // width, height
        .toFormat('jpeg') // to jpeg
        .jpeg({ quality: 90 }) // 90% quality
        .toFile(`public/img/tours/${req.body.imageCover}`);
    
    // Resizing tour images
    req.body.images = []; // images field in tour model expects string of image name files
    await Promise.all(req.files.images.map(async (file, i) => {
        const filename = `tour-${req.params.id}-${Date.now()}-${i + 1}.jpeg`; 

    await sharp(file.buffer)
        .resize(2000, 1333) // width, height
        .toFormat('jpeg') // to jpeg
        .jpeg({ quality: 90 }) // 90% quality
        .toFile(`public/img/tours/${filename}`);

    // Pushing files to images on body
    req.body.images.push(filename);
    }));

    next();
});


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

// GET - Tour Distances | Geospatial
exports.getDistances = catchAsync(async (req, res, next) => {
    // Declaring Variables
    const { latlng, unit } = req.params;
    const [lat, lng] = latlng.split(','); 

    // Mi / Km Multiplier
    const multipler = unit === 'mi' ? 0.000621371 : 0.001;

    // Check if lat and lng exists
    if (!lat || !lng) {
        next(new AppError('Provide lantitude and longitude in the format: lat, lng', 400));
    }

    // Aggregation Pipeline for Geospatial
    const distances = await Tour.aggregate([
        {
            $geoNear: { // geoNear is the only geospatial stage in aggregation pipeline and always has to be declared first
                near: { // point on which to calculate distances
                    type: 'Point',
                    coordinates: [lng * 1, lat * 1] // *1 to convert to numbers
                },
                distanceField: 'distance', // distance field will be created holding distances
                distanceMultiplier: multipler // Multiple distances by 1000
            }
        },
        {
            $project: { // Which fields will be outputed
                distance: 1,
                name: 1
            }
        }
    ]);

    // Sending Status & JSON
    res.status(200).json({
        status: 'success',
        data: {
            distances
        }
    });
});