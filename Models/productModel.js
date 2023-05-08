const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const Joi = require('joi');

const productSchema = new Schema({
    name: {
        type: String,
        maxlength: 50,
        minlength: 3,
        required: true
    },
    price: {
        type: Number,
        min: 1,
        required: true
    },
    quantity: {
        type: Number,
        min: 1,
        required: true
    },
    description: {
        type: String,
        maxlength: 500,
        minlength: 5,
        required: true
    },
    owner: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    productImage: {
        type: String,
        required: true
    }
});

const Product = mongoose.model('product', productSchema);

// Joi validation for req body
function validateProduct(product) {
    const schema = Joi.object({
        name: Joi.string().min(3).max(50).required(),
        price: Joi.string().min(1).required(),
        quantity: Joi.string().min(1).required(),
        description: Joi.string().min(5).max(500).required(),
        productImage: Joi.string().required()
    })
    return schema.validate(product);
}

module.exports = {
    Product,
    validateProduct
}