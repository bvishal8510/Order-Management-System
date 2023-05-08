const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const jwt = require('jsonwebtoken');
const config = require('config');
const Joi = require('joi');
const { userRoles } = require('../constants');

const userSchema = new Schema({
    firstName: {
        type: String,
        maxlength: 50,
        minlength: 5,
        required: true
    },
    lastName: {
        type: String,
        maxlength: 50,
        minlength: 5,
        required: true
    },
    email: {
        type: String,
        maxlength: 60,
        minlength: 5,
        required: true
    },
    password: {
        type: String,
        maxlength: 512,
        minlength: 5,
        required: true
    },
    phoneNumber: {
        type: Number,
        required: true,
        validate: {
            validator: function (v) {
                return /^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/.test(v);
            },
            message: 'Invalid phone number'
        }
    },
    role: {
        type: String,
        enum: Object.values(userRoles),
        required: true
    }
});

// generating auth token for user 
userSchema.methods.generateAuthToken = function () {
    const token = jwt.sign({ _id: this._id, role: this.role }, config.get('jwtPrivateKey'));
    return token;
}

const User = mongoose.model('user', userSchema);

// Joi validation for req body
function validateUser(user) {
    const schema = Joi.object({
        firstName: Joi.string().min(5).max(50).required(),
        lastName: Joi.string().min(5).max(50).required(),
        email: Joi.string().min(5).max(60).email().required(),
        password: Joi.string().min(5).max(512).required(),
        phoneNumber: Joi.string().regex(/^(\+\d{1,2}\s)?\(?\d{3}\)?[\s.-]?\d{3}[\s.-]?\d{4}$/).required(),
        role: Joi.string().required()
    });
    return schema.validate(user);
}

module.exports = {
    User,
    validateUser
}