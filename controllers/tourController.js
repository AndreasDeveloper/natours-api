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