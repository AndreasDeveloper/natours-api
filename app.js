// Importing Dependencies
const epxress = require('express'),
      fs = require('fs');


const app = epxress();

// * - Routes - * \\

// Reading Tours JSON Data
const tours = JSON.parse(fs.readFileSync(`${__dirname}/dev-data/data/tours-simple.json`));

app.get('/api/v1/tours', (req, res) => {
    res.status(200).json({
        status: 'success',
        results: tours.length,
        data: {
            tours
        }
    });
});








// Listening Server
const port = 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}..`);
});