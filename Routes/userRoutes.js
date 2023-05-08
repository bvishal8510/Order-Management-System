const express = require('express');
const router = express.Router();
const { adminOrRepresentative } = require('../Middlewares/permissionMiddlewares');
const { addUserValidateDataEntry } = require('../DataEntryAndValidation/userDataEntryAndValidation');
const {
    addUser,
    viewUsers,
    viewShops
} = require('../Controllers/userControllers')

router.post('/adduser', adminOrRepresentative, addUserValidateDataEntry, addUser);
router.get('/viewusers', viewUsers);
router.get('/viewshops', viewShops)


module.exports = router;
