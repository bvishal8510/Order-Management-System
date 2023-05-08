const express = require('express');
const router = express.Router();
const {
    adminOrDealerOrShopkeeper,
    adminOrRepresentative,
    onlySellerOfOrder,
    onlyBuyerOfOrder,
    adminOrSellerOrBuyerOrRepresentativeOfOrder
} = require('../Middlewares/permissionMiddlewares');
const {
    addGeneralOrderValidateDataEntry,
    addRepresentativeOrderValidateDataEntry,
    changeOrderStatusValidateDataEntry
} = require('../DataEntryAndValidation/orderDataEntryAndValidation');
const {
    addOrderGeneral,
    addOrderRepresentative,
    confirmOrder,
    changeOrderStatus,
    viewOrders,
    viewSingleOrder
} = require('../Controllers/orderController')

router.post('/addorder/general', adminOrDealerOrShopkeeper, addGeneralOrderValidateDataEntry, addOrderGeneral);
router.post('/addorder/representative', adminOrRepresentative, addRepresentativeOrderValidateDataEntry, addOrderRepresentative);
router.post('/confirmorder/:id', onlyBuyerOfOrder, confirmOrder);
router.post('/changestatus/:id', onlySellerOfOrder, changeOrderStatusValidateDataEntry, changeOrderStatus);
router.get('/vieworder/:id', adminOrSellerOrBuyerOrRepresentativeOfOrder, viewSingleOrder);
router.get('/vieworders', viewOrders);


module.exports = router;
