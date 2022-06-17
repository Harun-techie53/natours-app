exports.tourAliasing = (req, res, next) => {
    req.query.sort = '-ratingsAverage,price';
    req.query.limit = '5';

    next();
}