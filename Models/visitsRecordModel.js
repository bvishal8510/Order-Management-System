const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const visitSchema = new Schema({
    visitor: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    visited: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    purpose: {
        type: String,
        maxlength: 100,
        minlength: 5,
        required: true
    },
    review: {
        type: String,
        maxlength: 500,
        minlength: 5,
        required: true
    },
    time: {
        type: Date,
        default: Date.now()
    }
});

const Visit = mongoose.model('visit', visitSchema);

// Joi validation for req body
function validateVisit(visit) {
    const schema = Joi.object({
        visited: Joi.string().required(),
        purpose: Joi.string().min(5).max(100).required(),
        review: Joi.string().min(5).required(),
    })
    return schema.validate(visit);
}

module.exports = {
    Visit,
    validateVisit
}