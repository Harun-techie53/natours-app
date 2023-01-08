const AppError = require("./appError");

module.exports = checkID = (req, res, next) => {
    const reqId = req.params.id;

    console.log(typeof reqId)

    if(!(typeof reqId === 'ObjectId')) {
        return next(new AppError(`${req.params.id} is not type of ObjectId!`, 400));
    }

    next();
}