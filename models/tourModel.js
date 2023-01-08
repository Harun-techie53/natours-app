const mongoose = require('mongoose');
const validator = require('validator');
const User = require('./userModel');

const tourSchema = new mongoose.Schema({
    name: {
        type: String,
        required: [true, 'Tour name is required'],
        trim: true,
        unique: true,
        maxlength: [40, 'Name must be less than or equal to 40 characters'],
        minlength: [10, 'Name must be more than or equal to 10 characters']
    },
    price: {
        type: Number,
        required: [true, 'Tour price is required']
    },
    priceDiscount: {
        type: Number,
        validate: {
            validator: function(val) {
                return val < this.price; // true means validate and false means not validate
            },
            message: 'Discount price should be less than regular price'
        }
    },
    duration: {
        type: Number,
        required: [true, 'A tour must have a duration']
    },
    maxGroupSize: {
        type: Number,
        required: [true, 'A tour must have a maximum group size']
    },
    difficulty: {
        type: String,
        required: [true, 'A tour must have a difficulty level'],
        enum: {
            values: ['easy', 'medium', 'difficult'],
            message: 'Difficulty is either: easy, medium or difficult'
        }
    },
    //Geo Spatial JSON
    startLocation: {
        type: {
            type: String,
            default: 'Point',
            enum: ['Point']
        },
        coordinates: [Number],
        address: String,
        description: String
    },
    locations: [
        {
            type: {
                type: String,
                default: 'Point',
                enum: ['Point']
            },
            coordinates: [Number],
            address: String,
            description: String,
            day: Number
        }
    ],
    ratingsAverage: {
        type: Number,
        default: 4.5,
        max: [5, 'Rating is less than or equal to 5.0'],
        min: [1, 'Rating is more than or equal to 1.0']
    },
    ratingsQuantity: {
        type: Number,
        default: 0
    },
    summary: {
        type: String,
        required: [true, 'A tour must have a summary'],
        trim: true
    },
    description: {
        type: String,
        trim: true
    },
    imageCover: {
        type: String,
        required: [true, 'A tour must have a cover image']
    },
    images: [String],
    guides: Array,
    created_At: {
        type: Date,
        default: Date.now()
    },
    startDates: [Date]
},
{   
    toJSON: { virtuals: true },
    toObject: { virtuals: true }
});

tourSchema.pre('save', async function(next) {
    if(this.guides !== undefined || this.guides.length !== 0) {
        const guidesPromises = this.guides.map(async (id) => await User.findById(id).select('-password -passwordChangedAt -__v'));
        this.guides = await Promise.all(guidesPromises);
    }

    next();
});

tourSchema.pre(/^find/, function(next) {
    this.populate({
        path: 'guides',
        select: '-__v -passwordChangedAt -password'
    });
    next();
});

tourSchema.virtual('reviews', {
    ref: 'Review',
    foreignField: 'tour',
    localField: '_id'
});

module.exports = Tour = mongoose.model('Tour', tourSchema);