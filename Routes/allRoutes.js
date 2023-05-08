const express = require('express');
const router = express.Router();
const { verifyToken } = require('../Middlewares/commonMiddleware');

const commonRouter = require('./commonRoutes');
const userRouter = require('./userRoutes');
const productRouter = require('./productRoutes');
const visitRouter = require('./visitRoutes');
const orderRouter = require('./orderRoutes');

router.use('/common', commonRouter);
router.use('/user', verifyToken, userRouter);
router.use('/product', verifyToken, productRouter);
router.use('/visit', verifyToken, visitRouter);
router.use('/order', verifyToken, orderRouter);

module.exports = router;
