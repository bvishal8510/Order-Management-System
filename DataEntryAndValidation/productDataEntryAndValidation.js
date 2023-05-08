const { validateProduct } = require('../Models/productModel');
const _ = require('lodash');
const { trimRequestBody } = require('../Utils/dataEntryAndValidationHelperFunctions');
const { messages } = require('../constants');

function addProductValidateDataEntry(req, res, next) {
    try {
        req.body = trimRequestBody(req.body);
        
        req.body = _.pick(req.body, ['name', 'price', 'quantity', 'description', 'productImage']);

        let { error } = validateProduct(req.body);
        if (error) return res.status(400).json({ message: messages.BAD_REQUEST, error: error });

        next();
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}


module.exports = {
    addProductValidateDataEntry,
}
