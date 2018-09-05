const mongoose = require('mongoose');

const shopSchema = mongoose.Schema({
    _id: mongoose.Schema.Types.ObjectId,
    language: { type: String, required: false },
    name: { type: String, required: false },
    country: { type: String, required: false },
    currency: { type: String, required: false },
    user_id: { type: String, required: false }
});

module.exports = mongoose.model('Shop', shopSchema);