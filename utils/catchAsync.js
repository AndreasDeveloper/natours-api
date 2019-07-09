// Catch Async Function | Try / Catch Wrapper
module.exports = fn => {
    return (req, res, next) => {
        fn(req, res, next).catch(next); // If error, it will be passed to global handler using next(err)
    };
};