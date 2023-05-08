const { Product } = require('../Models/productModel')
const { PurchasedProduct } = require('../Models/purchasedProductModel');

async function saveBulkProducts(orderedItems, seller) {
    try {
        let purchasedProductIDList = [];
        let purchasedProductObjectList = [];
        let orderedProductsName = {};
        
        // list id of ordered products 
        let orderedProductsIdList = Object.keys(orderedItems);
        // getting object of products from Product table using above ids
        let products = await Product.find({ '_id': { $in: orderedProductsIdList } });

        // to create purchased product object corresponding to each ordered product and update quantity in product objects 
        for (let product of products) {
            let orderedQuantity = orderedItems[product._id];
            orderedProductsName[product.name] = orderedQuantity;

            // if quantity of product in product table is less than ordered then error
            if (product.quantity < orderedQuantity) throw new Error("Invalid product quantity!!!");
            // all ordered products must be from same seller
            if (product.owner != seller) throw new Error('Products do not belong to a seller');

            let purchasedProduct = new PurchasedProduct({ product: product._id, quantity: orderedQuantity });
            purchasedProductIDList.push(purchasedProduct._id);
            purchasedProductObjectList.push(purchasedProduct);
            product.quantity = product.quantity - orderedQuantity;
        }

        // saving ordered products in purchased product table 
        await PurchasedProduct.insertMany(purchasedProductObjectList);

        //next two lines to update quantity of products in product table
        await Product.deleteMany({ '_id': { $in: orderedProductsIdList } });
        await Product.insertMany(products);

        // returning list of purchased products id to be saved in order table and 
        // also name of product along with quantity helpful while sending email
        return {
            purchasedProductIDList: purchasedProductIDList,
            orderedProductsName: orderedProductsName
        };
    }
    catch (ex) {
        return ex;
    }
}


module.exports = {
    saveBulkProducts,
}
