const { userRoles, messages } = require('../constants');
const { GeneralOrder } = require('../Models/genralOrderModel');
const { RepresentativeOrder } = require('../Models/orderByRepresentativeModel');
const { Product } = require('../Models/productModel');

function adminOnly(req, res, next) {
    if (req.role == userRoles.ADMIN) next();
    else return res.status(401).json({ message: messages.UNAUTHORIZED });
}

function adminOrRepresentative(req, res, next) {
    if (req.role == userRoles.ADMIN) next();

    // if representative without role in req body then pass
    // else if role is shopkeeper then pass
    // else reject
    else if (req.role == userRoles.REPRESENTATIVE) {
        if (!(req.body.hasOwnProperty('role'))) next();

        else if (req.body.role == userRoles.SHOPKEEPER) next();

        else return res.status(401).json({ message: messages.UNAUTHORIZED });
    }

    else return res.status(401).json({ message: messages.UNAUTHORIZED });
}

function adminOrDealer(req, res, next) {
    if (req.role == userRoles.ADMIN || req.role == userRoles.DEALER) next();
    else return res.status(401).json({ message: messages.UNAUTHORIZED });
}

function adminOrDealerOrShopkeeper(req, res, next) {
    if (req.role == userRoles.ADMIN || req.role == userRoles.DEALER || req.role == userRoles.SHOPKEEPER) next();
    else return res.status(401).json({ message: messages.UNAUTHORIZED });
}

async function onlySellerOfOrder(req, res, next) {
    try {
        let order = await RepresentativeOrder.findOne({ _id: req.params.id }) ||
            await GeneralOrder.findOne({ _id: req.params.id });

        if (!order) return res.status(404).json({ message: messages.OBJECT_NOT_FOUND });

        if (order.seller == req.id) {
            req.order = order;
            next();
        }
        else return res.status(401).json({ message: messages.UNAUTHORIZED });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.BAD_REQUEST, error: ex });
    }
}

async function onlyBuyerOfOrder(req, res, next) {
    try {
        let order = await RepresentativeOrder.findOne({ _id: req.params.id });

        if (!order) return res.status(404).json({ message: messages.OBJECT_NOT_FOUND });

        if (order.buyer == req.id) {
            req.order = order;
            next();
        }
        else return res.status(401).json({ message: messages.UNAUTHORIZED });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.BAD_REQUEST, error: ex });
    }
}

async function adminOrSellerOrBuyerOrRepresentativeOfOrder(req, res, next) {
    try {
        let order = await RepresentativeOrder.findOne({ _id: req.params.id })
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
                                                }) ||
                    await GeneralOrder.findOne({ _id: req.params.id })
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

        if (!order) return res.status(404).json({ message: messages.OBJECT_NOT_FOUND });

        if (req.role == userRoles.ADMIN || order.seller == req.id || order.buyer == req.id || order.placedBy == req.id) {
            req.order = order;
            next();
        }

        else return res.status(401).json({ message: messages.UNAUTHORIZED });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}



module.exports = {
    adminOnly,
    adminOrDealer,
    adminOrRepresentative,
    adminOrDealerOrShopkeeper,
    onlySellerOfOrder,
    onlyBuyerOfOrder,
    adminOrSellerOrBuyerOrRepresentativeOfOrder
}
