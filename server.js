// Setting Environmental Variables
const dotenv = require('dotenv');
dotenv.config({path: './config.env'});
// Importing Modules
const app = require('./app');

// Listening Server
const port = process.env.PORT || 3000;
app.listen(port, () => {
    console.log(`App running on port ${port}..`);
});