const { GeneralOrder } = require('../Models/genralOrderModel');
const { RepresentativeOrder } = require('../Models/orderByRepresentativeModel');
const { User } = require('../Models/usersModel');
const { Product } = require('../Models/productModel');
const { saveBulkProducts } = require('../Utils/saveBulkPurchaseProducts');
const { sendEmail } = require('../Utils/sendEmail');
const _ = require('lodash');
const { statusList, messages } = require('../constants');

/*
    Description: to add order
    Request body: {
        orderedProducts:{
                Id of product1: quantity required,
                Id of product2: quantity required
            },
        seller: id of to whom order must be placed,
        address: address of delivery
    }
*/
async function addOrderGeneral(req, res) {
    try {
        // sending data of products to save into purchased products and return id and details of purchased products
        let returnedData = await saveBulkProducts(req.body.orderedProducts, req.body.seller);

        if (!returnedData.orderedProducts && !returnedData.orderedProductsName) {
            returnedData = returnedData.toString();
            return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: returnedData });
        }

        req.body.orderedProducts = returnedData.purchasedProductIDList;

        if (!req.body.orderedProducts) return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });

        req.body.buyer = req.id;
        req.body.status = statusList.CONFIRMED;

        let generalOrder = new GeneralOrder(req.body);

        // finding buyer and seller to send mail regarding order placed
        let users = await User.find({ $or: [{ _id: req.id }, { _id: generalOrder.seller }] });

        // list of email id of seller and buyer
        let emailTo = [];

        for (let user of users) {
            emailTo.push(user.email);
        }

        let message = '';           // stores details of products ordered as string

        for (let item in returnedData.orderedProductsName) {
            message += ' ' + item + ' - ' + returnedData.orderedProductsName[item].toString() + ', ';
        }

        // sending mail to buyer and seller
        let verifyEmailSent = await sendEmail(
            emailTo,
            'Order Placed',
            `<p>Order with order id ${generalOrder._id} and details ${message} has been placed</p>`
        );

        if (verifyEmailSent != 1) {
            return res.status(400).json({
                message: 'Email not sent. Please connect to valid network and try again'
            });
        }

        await generalOrder.save();

        return res.status(200).json({
            message: "Success",
            generalOrder: _.pick(generalOrder, ['_id', 'buyer', 'seller', 'status', 'orderedProducts', 'address', 'time',]),
        });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

/*
    Description: to add order by representative
    Request body: {
        orderedProducts:{
                Id of product1: quantity required,
                Id of product2: quantity required
            },
        seller: id of dealer to whom order must be placed,
        buyer: id of shopkeeper for whom order is placed,
        address: address of delivery
    }
*/
async function addOrderRepresentative(req, res) {
    try {
        let returnedData = await saveBulkProducts(req.body.orderedProducts, req.body.seller);

        if (!returnedData.orderedProducts && !returnedData.orderedProductsName) {
            returnedData = returnedData.toString();
            return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: returnedData });
        }

        req.body.orderedProducts = returnedData.purchasedProductIDList;

        if (!req.body.orderedProducts) return res.status(500).json({ message: "Something went wrong!!!", error: ex });

        req.body.placedBy = req.id;
        req.body.status = statusList.ONHOLD;

        let representativeOrder = new RepresentativeOrder(req.body);

        // finding buyer and seller to send mail regarding order placed
        let users = await User.find({ $or: [{ _id: representativeOrder.buyer }, { _id: representativeOrder.seller }] });

        // list of email id of seller and buyer
        let emailTo = [];

        for (let user of users) {
            emailTo.push(user.email);
        }

        let message = '';                           // stores details of products ordered as string

        for (let item in returnedData.orderedProductsName) {
            message += ' ' + item + ' - ' + returnedData.orderedProductsName[item].toString() + ', ';
        }

        // link shopkeeper need to request to confirm order
        let url = `http://127.0.0.1:3000/order/confirmorder/${representativeOrder._id}`;

        // sending mail to buyer and seller
        let verifyEmailSent = await sendEmail(
            emailTo,
            'Order Placed',
            `<p>Order with order id ${representativeOrder._id} and details ${message} has been placed and put on hold.
                                        Shopkeeper, please confirm the order by click this <a href=${url}>link</a> after login into your account.</p>`
        );

        if (verifyEmailSent != 1) {
            return res.status(400).json({
                message: 'Email not sent. Please connect to valid network and try again'
            });
        }

        await representativeOrder.save();

        return res.status(200).json({
            message: "Success",
            representativeOrder: _.pick(
                representativeOrder, ['_id', 'buyer', 'seller', 'placedBy', 'status', 'orderedProducts', 'address', 'time']
            ),
        });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

async function confirmOrder(req, res) {
    try {
        req.order.status = statusList.CONFIRMED;
        req.order.save();
        return res.status(200).json({ message: "Order confirmed!!!" });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

/*
    Description: change status of order placed
    url params: id of order
    Request body: {
        status: status to order
    }
*/
async function changeOrderStatus(req, res) {
    try {
        req.order.status = req.body.status;
        req.order.save();
        return res.status(200).json({ message: "Success!!!" });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

/*
    Description: view all orders placed for him or by him
*/
async function viewOrders(req, res) {
    try {
        let firstOrderList = await RepresentativeOrder.find({ $or: [{ buyer: req.id }, { seller: req.id }] })
            .select('-__v')
            .populate('buyer', 'firstName lastName -_id')
            .populate('seller', 'firstName lastName -_id')
            .populate('placedBy', 'firstName lastName -_id')
            .populate({
                path: 'orderedProducts',
                select: 'quantity -_id',
                populate: {
                    path: 'product',
                    model: Product,
                    select: 'name -_id'
                }
            });
        let secondOrderList = await GeneralOrder.find({ $or: [{ buyer: req.id }, { seller: req.id }] })
            .select('-__v')
            .populate('buyer', 'firstName lastName -_id')
            .populate('seller', 'firstName lastName -_id')
            .populate({
                path: 'orderedProducts',
                select: 'quantity -_id',
                populate: {
                    path: 'product',
                    model: Product,
                    select: 'name -_id'
                }
            });

        let allOrders = await [...firstOrderList, ...secondOrderList];

        if (allOrders.length == 0) return res.status(404).json({ message: "No orders present" });

        return res.status(200).json({ message: "Success!!!", orders: allOrders });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

/*
    Description: view particular order
*/
async function viewSingleOrder(req, res) {
    try {
        return res.status(200).json({ message: "Success!!!", order: req.order });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

async function deleteOrder(req, res) {
    //delete order
}

module.exports = {
    addOrderGeneral,
    addOrderRepresentative,
    confirmOrder,
    changeOrderStatus,
    viewOrders,
    viewSingleOrder
};