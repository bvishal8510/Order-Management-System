const mongoose = require('mongoose');

function trimRequestBody(body) {
    for(key in body) {
        // trim the value if it is string
        if(typeof body[key] == 'string') body[key] = body[key].trim();
    }
    return body;
}

function validateID(id) {
    return mongoose.Types.ObjectId.isValid(id);
}

module.exports = {
    trimRequestBody,
    validateID
}