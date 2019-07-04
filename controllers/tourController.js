// Importing Models
const Tour = require('../models/tourModel');

// Reading Tours JSON Data
// const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// Handler Functions for TOURS
// GET - All Tours
exports.getAllTours = async (req, res) => {
    try {
        // Getting All Tours
        const allTours = await Tour.find({});

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
    // // Sending JSON
    // res.status(200).json({
    //     status: 'success',
    //     data: {
    //         tour
    //     }
    // });
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
exports.updateTour = (req, res) => {
    // Sending JSON
    res.status(200).json({
        status: 'success',
        data: {
            tour: 'Updated Tour Placeholder' // updated tour
        }
    });
};

// DELETE - Specific Tour
exports.deleteTour = (req, res) => {
    // Sending JSON
    res.status(204).json({ // 204 - No Content
        status: 'success',
        data: null
    });
};