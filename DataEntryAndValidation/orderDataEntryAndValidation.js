const { trimRequestBody, validateID } = require('../Utils/dataEntryAndValidationHelperFunctions');
const { statusList, messages } = require('../constants');
const _ = require('lodash');

function addGeneralOrderValidateDataEntry(req, res, next) {
    try {
        req.body = trimRequestBody(req.body);

        req.body = _.pick(req.body, ['orderedProducts', 'seller', 'address']);

        if (!req.body.orderedProducts || Object.keys(req.body.orderedProducts).length == 0) {
            return res.status(401).json({ message: "No products ordered" });
        }

        if (!validateID(req.body.seller)) return res.status(401).json({ message: messages.BAD_REQUEST, error: "Invalid seller id" });

        if (!req.body.address || req.body.address.length == 0) {
            return res.status(401).json({ message: messages.BAD_REQUEST, error: "Invalid Address" });
        }
        next();
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

function addRepresentativeOrderValidateDataEntry(req, res, next) {
    try {
        req.body = trimRequestBody(req.body);

        req.body = _.pick(req.body, ['orderedProducts', 'seller', 'address', 'buyer']);

        if (!req.body.orderedProducts || Object.keys(req.body.orderedProducts).length == 0) {
            return res.status(401).json({ message: "No products ordered" });
        }

        if (!validateID(req.body.seller)) return res.status(401).json({ message: messages.BAD_REQUEST, error: "Invalid seller id" });

        if (!validateID(req.body.buyer)) return res.status(401).json({ message: messages.BAD_REQUEST, error: "Invalid buyer id" });

        if (!req.body.address || req.body.address.length == 0) {
            return res.status(401).json({ message: messages.BAD_REQUEST, error: "Invalid Address" });
        }

        next();
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

function changeOrderStatusValidateDataEntry(req, res, next) {
    try {
        req.body = trimRequestBody(req.body);

        req.body = _.pick(req.body, ['status']);

        if (!Object.values(statusList).includes(req.body.status)) {
            return res.status(401).json({ message: messages.BAD_REQUEST, error: "Invalid status" });
        }

        next();
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}


module.exports = {
    addGeneralOrderValidateDataEntry,
    addRepresentativeOrderValidateDataEntry,
    changeOrderStatusValidateDataEntry
}
