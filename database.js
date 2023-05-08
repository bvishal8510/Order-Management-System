const mongoose = require('mongoose');

module.exports = function () {
    try {
        //creating db connection
        mongoose.connect('mongodb://localhost/order_management_app', { useNewUrlParser: true, useUnifiedTopology: true, useCreateIndex: true });
        console.log('Connection to db successful!!!!');
    }
    catch (ex) {
        console.log(ex);
        process.exit(1);
    }
}