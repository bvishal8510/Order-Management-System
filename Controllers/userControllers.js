const { User } = require('../Models/usersModel');
const { Shop } = require('../Models/shopModel');
const { saltValue } = require('../constants');
const bcrypt = require('bcrypt');
const _ = require('lodash');
const { userRoles } = require('../constants');
const { sendEmail } = require('../Utils/sendEmail');
const { messages } = require('../constants');

/*
    Description: to add user to system database
    Request body: {
        firstName: firstname of user
        lastName: lastname of user
        email: emailId of user
        password: password of user
        phoneNumber: phone number of user
        role: role assigned to user i.e. dealer, representative, shopkeeper, etc.
        name: name of shop in case of role is shopkeeper
        address: address of shop in case of role is shopkeeper
    }
*/
async function addUser(req, res) {
    try {
        let shop = {};
        let password = req.user.password;

        // checking if user with email already exist
        let user = await User.findOne({ email: req.user.email });
        if (user) return res.status(401).json({ message: "User already exists" });

        user = new User(req.user);
        const salt = await bcrypt.genSalt(saltValue);
        user.password = await bcrypt.hash(user.password, salt);

        // sending mail to registered user
        let verifyEmailSent =  await sendEmail(
                                        user.email,
                                        'Registration in Order Management App',
                                        `<p>Your registration in Order Management App has been done successfully with
                                        email id - ${user.email} and password - ${password}. You can use these to login into your account.</p>`
                                    );
        
        if(verifyEmailSent != 1) {
            return res.status(400).json({ 
                message: 'Email not sent. Please connect to valid network and try again' 
            });
        }

        // adding shop if role is shopkeeper
        if (user.role === userRoles.SHOPKEEPER) {
            shop = new Shop(req.shop);
            shop.owner = user._id;
            shop.save();
        }

        await user.save();

        return res.status(200).json({
            message: "Sucessfully Registered",
            user: _.pick(user, ['_id', 'firstName', 'lastName', 'firstName', 'email', 'phoneNumber', 'role']),
            shop: _.pick(shop, ['_id', 'name', 'address'])
        });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

/*
    Description: to view users
    query params: {
        role: role of user
             or
        email: emailid of user
             or
        nothing for all users
    }
*/
async function viewUsers(req, res) {
    try {
        let users = await User.find(req.query).select('-password -__v');

        if (!users || users.length == 0) return res.status(404).json({ message: messages.OBJECT_NOT_FOUND });

        return res.status(200).json({ message: "Success", users: users });

    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

/*
    Description: view the shop
    query params: {
        name: name of shop
             or
        owner: id of owner
             or
        nothing for all shops
    }
*/
async function viewShops(req, res) {
    try {
        let shops = await Shop.find(req.query)
            .populate('owner', 'firstName lastName -_id')
            .select('-password -__v');

        if (!shops || shops.length == 0) return res.status(404).json({ message: messages.OBJECT_NOT_FOUND });

        return res.status(200).json({ message: "Success", shops: shops });

    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

async function editUser(req, res) {
    // edit user details
}

async function deleteUser(req, res) {
    // delete user
}


module.exports = {
    addUser,
    viewUsers,
    viewShops
};