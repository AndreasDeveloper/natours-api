// Class API Features
class APIFeatures {
    constructor(query, queryString) {
        this.query = query;
        this.queryString = queryString;
    }

    // Filtering
    filter() {
        // Query Manipulation - Destructuring query object, excluding fields | FILTERING
        const queryObj = {...this.queryString}; // rest paramter will take all of the fields from req.query and create new object as it was encapsulated with {}
        const excludedFields = ['page', 'sort', 'limit', 'fields'];
        excludedFields.forEach(el => delete queryObj[el]); // Deleting fields (keys) from query Object
        // Query Manipulation - Replacing logical operators from query | ADVANCED FILTERING
        let queryStr = JSON.stringify(queryObj);
        queryStr = queryStr.replace(/\b(gte|gt|lte|lt)\b/g, match => `$${match}`);

        // Getting All Tours || Filtering / Querying using mongoose or req.query > Build Query
        this.query = this.query.find(JSON.parse(queryStr));
        // Returning entire object
        return this;
    }

    // Sort
    sort() {
        // Sorting
        if (this.queryString.sort) {
            const sortBy = this.queryString.sort.split(',').join(' ');
            this.query = this.query.sort(sortBy);
        } else { // Default sort
            this.query = this.query.sort('-ratingsAverage');
        }
        // Returning entire object
        return this;
    }

    // Field Limiting
    limitFields() {
        // Field Limiting - fields=
        if (this.queryString.fields) { 
            const fields = this.queryString.fields.split(',').join(' '); // exclude commas, join by empty spaces to get a full string
            this.query = this.query.select(fields);
        } else { // Default fields
            this.query = this.query.select('-__v'); // - (minus) presents excluding
        }
        // Returning entire object
        return this;
    }

    // Pagination
    pagination() {
        const page = this.queryString.page * 1 || 1; // converting string to number. default is 1
        const limit = this.queryString.limit * 1 || 100; // Results per page
        const skip = (page - 1) * limit; // page - 1 = previous page * limit
        // Skipping and Limiting
        this.query = this.query.skip(skip).limit(limit);
        // Count document and check if page doesn't exists
        // if (this.this.queryString.page) {
        //     const numTours = await Tour.countDocuments(); // Count tours - total number of tours
        //     if (skip >= numTours) throw new Error('This page does not exist');
        // }
        // Returning entire object
        return this;
    }
};

module.exports = APIFeatures;