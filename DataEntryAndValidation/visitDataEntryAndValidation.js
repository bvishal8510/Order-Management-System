const { validateVisit } = require('../Models/visitsRecordModel');
const _ = require('lodash');
const { trimRequestBody, validateID } = require('../Utils/dataEntryAndValidationHelperFunctions');
const { messages } = require('../constants');

function addVisitValidateDataEntry(req, res, next) {
    try {
        req.body = trimRequestBody(req.body);

        req.body = _.pick(req.body, ['visited', 'purpose', 'review']);

        let { error } = validateVisit(req.body);
        if (error) return res.status(400).json({ message: messages.BAD_REQUEST, error: error });

        if (!validateID(req.body.visited)) return res.status(401).json({ message: "Invalid shopkeeper id" });

        next();
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}


module.exports = {
    addVisitValidateDataEntry,
}
