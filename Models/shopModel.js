const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const shopSchema = new Schema({
    name: {
        type: String,
        maxlength: 50,
        minlength: 5,
        required: true
    },
    address: {
        type: String,
        maxlength: 250,
        minlength: 5,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    }
});

const Shop = mongoose.model('shop', shopSchema);

// Joi validation for req body
function validateShop(shop) {
    const schema = Joi.object({
        name: Joi.string().min(5).max(50).required(),
        address: Joi.string().min(5).max(250).required()
    })
    return schema.validate(shop);
}

module.exports = {
    Shop,
    validateShop
}