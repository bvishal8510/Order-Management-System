const { validateUser } = require('../Models/usersModel');
const { validateShop } = require('../Models/shopModel');
const _ = require('lodash');
const { userRoles, messages } = require('../constants');
const { trimRequestBody } = require('../Utils/dataEntryAndValidationHelperFunctions');

function addUserValidateDataEntry(req, res, next) {
    try {
        req.body = trimRequestBody(req.body);
        
        req.user = _.pick(req.body, ['firstName', 'lastName', 'email', 'password', 'phoneNumber', 'role']);
        req.shop = _.pick(req.body, ['name', 'address']);

        let { error } = validateUser(req.user);
        if (error) return res.status(400).json({ message: messages.BAD_REQUEST, error: error });

        // if role is shopkeeper then validate the shop data
        if (req.user.role == userRoles.SHOPKEEPER) {
            let { error } = validateShop(req.shop);
            if (error) return res.status(400).json({ message: messages.BAD_REQUEST, error: error });
        }

        next();
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}


module.exports = {
    addUserValidateDataEntry,
}
