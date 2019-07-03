// Importing Dependencies
const fs = require('fs');

// Reading Tours JSON Data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/../dev-data/data/tours-simple.json`));

// Param Middleware - Checking the ID in Params
exports.checkID = (req, res, next, val) => { // val is value of a parameter (id in this case)
    // Check if id doesn't exist
    if (val * 1 > tours.length) {
        return res.status(404).json({ status: 'fail', message: 'Invalid ID' });
    }
    next();
};


// Handler Functions for TOURS
// GET - All Tours
exports.getAllTours = (req, res) => {
    // Sending JSON
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
};

// GET - Specific Tour
exports.getTour = (req, res) => {
    const id = req.params.id * 1; // Convert number string to Number
    const tour = tours.find(el => el.id === id);
    // Sending JSON
    res.status(200).json({
        status: 'success',
        data: {
            tour
        }
    });
};

// POST - New Tour
exports.createTour = (req, res) => {
    const newId = tours[tours.length - 1].id + 1; // Assigning new id to new object
    const newTour = Object.assign({ id: newId }, req.body); // Creating new object

    tours.push(newTour); // Pushing the object
    fs.writeFile(`${__dirname}/dev-data/data/tours-simple.json`, JSON.stringify(tours), err => { // Writing new object to .json file
        // Sending JSON
        res.status(201).json({ // 201 - Writen Content
            status: 'success', 
            data: {
                tour: newTour
            }
        })
    });
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