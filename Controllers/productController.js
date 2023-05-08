const { Product } = require('../Models/productModel');
const _ = require('lodash');
const { messages } = require('../constants');

/*
    Description: to add product
    Request body: {
        name: name of product,
        price: price of product,
        quantity: quantity of product,
        description: description of product,
        productImage: url of image
    }
*/
async function addProduct(req, res) {
    try {
        let product = await Product.findOne({ name: req.body.name, owner: req.id });
        if (product) return res.status(401).json({ message: "Product already exists" });

        product = new Product(req.body);
        product.owner = req.id;
        await product.save();

        return res.status(200).json({
            message: "Success",
            product: _.pick(product, ['_id', 'name', 'price', 'quantity', 'description', 'owner', 'productImage']),
        });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: ex });
    }
}

/*
    Description: search the product
    query params: {
        name: name of product
             or
        owner: id of owner
             or
        nothing for all products
    }
*/
async function viewProducts(req, res) {
    try {
        let products = await Product
                            .find(req.query)
                            .populate('owner', 'firstName lastName')
                            .select('-__v');

        if (!products || products.length == 0) return res.status(404).json({ message: messages.OBJECT_NOT_FOUND });

        return res.status(200).json({ message: "Success", products: products });
    }
    catch (ex) {
        return res.status(500).json({ message: messages.INTERNAL_SERVER_ERROR, error: "Invalid query" });
    }
}

async function editProducts(req, res) {
    //edit the product
}

async function deleteProducts(req, res) {
    //delete the product
}

module.exports = {
    addProduct,
    viewProducts
};