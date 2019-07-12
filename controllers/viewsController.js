// GET - Overview of Tours
exports.getOverview = (req, res) => {
    res.status(200).render('overview', { title: 'All Tours' });
};

// GET - Tour
exports.getTour = (req, res) => {
    res.status(200).render('tour', { title: 'The Forest Hiker Tour' });
};