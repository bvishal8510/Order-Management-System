const express = require('express');
const router = express.Router();
const {
    userLogin,
    demoFunc
} = require('../Controllers/commonController')

router.post('/login', userLogin);
router.get('/demoRoute', demoFunc);

module.exports = router;
