const mongoose = require('mongoose');

//Review, Rating, createdAt, tour, user
const reviewSchema = new mongoose.Schema({
    review: {
        type: String,
        required: [true, 'Review is required!']
    },
    rating: {
        type: Number,
        min: 1,
        max: 5,
        required: [true, 'Rating is required!']
    },
    createAt: {
        type: Date,
        default: Date.now
    },
    tour: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'Tour'
    },
    user: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User'
    }
},
{   
    toJSON: { virtual: true },
    toObject: { virtual: true }
});

reviewSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'tour',
        select: 'name -guides'
    }).populate({
        path: 'user',
        select: 'name photo'
    });
    next();
})

module.exports = Review = mongoose.model('Review', reviewSchema);