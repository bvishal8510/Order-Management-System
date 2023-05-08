const express = require('express');
const router = express.Router();
const {
    adminOnly,
    adminOrRepresentative
} = require('../Middlewares/permissionMiddlewares');
const { addVisitValidateDataEntry } = require('../DataEntryAndValidation/visitDataEntryAndValidation');
const {
    addVisit,
    viewVisit
} = require('../Controllers/visitController');

router.post('/addvisit', adminOrRepresentative, addVisitValidateDataEntry, addVisit);
router.get('/viewvisit', adminOnly, viewVisit);


module.exports = router;
