const { User } = require('../Models/usersModel');
const bcrypt = require('bcrypt');
const { messages } = require('../constants');

/*
    Description: to login user
    Request body: {
        email: emailId of user,
        password: password of user
    }
*/
async function userLogin(req, res) {
    try {
        let user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: messages.OBJECT_NOT_FOUND });

        const validPassword = await bcrypt.compare(req.body.password, user.password);     // comparing passwords
        if (!validPassword) return res.status(400).json({ message: "Invalid Credentails!!!" });

        const token = user.generateAuthToken();
        return res.cookie('x-auth-token', token).status(200)
            .json({ message: "Successful login" });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
};


async function demoFunc(req, res) {
    try {
        return res.status(200).json({ message: "Response retuned from demoFunc", StatusCode: "SUCCESS" });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
};

module.exports = {
    userLogin,
    demoFunc
};