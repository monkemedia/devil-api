const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    name: { type: String, required: true },
    price: { type: Number, required: true },
    is_sale: { type: Boolean, require: true },
    sale_price: { type: Number, required: function () {
        return this.is_sale;
    }},
    category: { type: String, required: true },
    username: { type: String, required: true },
    merchant_id: { type: String, required: true },
    store_front: { type: Boolean, required: true },
    description: { type: String, required: true }
});

module.exports = mongoose.model('Product', productSchema);