const express = require('express');
const router = express.Router();
const { adminOrDealer } = require('../Middlewares/permissionMiddlewares');
const { addProductValidateDataEntry } = require('../DataEntryAndValidation/productDataEntryAndValidation');
const {
    addProduct,
    viewProducts
} = require('../Controllers/productController')

router.post('/addproduct', adminOrDealer, addProductValidateDataEntry, addProduct);
router.get('/viewproduct', viewProducts);


module.exports = router;
