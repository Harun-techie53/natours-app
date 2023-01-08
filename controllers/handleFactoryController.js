const AppError = require("../utils/appError");
const catchAsync = require('../utils/catchAsync');

exports.deleteOne = (Model) => catchAsync(async (req, res, next) => {
    const obj = await Model.findByIdAndRemove(reqId);

    if(!obj) {
        return next(new AppError('Document not found!', 404));
    }

    res.status(204).json({
        status: 'success'
    });
});