const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const purchasedProductSchema = new Schema({
    product: {
        type: Schema.Types.ObjectId,
        ref: 'product',
        required: true
    },
    quantity: {
        type: Number,
        min: 1,
        required: true
    }
});

const PurchasedProduct = mongoose.model('purchasedproduct', purchasedProductSchema);

module.exports = {
    PurchasedProduct
}