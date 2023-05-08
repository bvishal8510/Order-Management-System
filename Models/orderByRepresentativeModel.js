const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const { statusList } = require('../constants');

const representativeOrderSchema = new Schema({
    buyer: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    seller: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    placedBy: {
        type: Schema.Types.ObjectId,
        ref: 'user',
        required: true
    },
    orderedProducts: [{
        type: Schema.Types.ObjectId,
        ref: 'purchasedproduct',
        required: true
    }],
    status: {
        type: String,
        enum: Object.values(statusList),
        required: true
    },
    address: {
        type: String,
        maxlength: 250,
        minlength: 5,
        required: true
    },
    time: {
        type: Date,
        default: Date.now()
    }
});

const RepresentativeOrder = mongoose.model('representativeorder', representativeOrderSchema);

module.exports = {
    RepresentativeOrder
}