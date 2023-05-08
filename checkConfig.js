const config = require('config');

module.exports = function () {
    // checking for all environment variables
    if (!config.get('jwtPrivateKey')) {
        console.log('JWT Private Key not found!!!!!');
        process.exit(1);
    }
}
