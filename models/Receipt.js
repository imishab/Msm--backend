const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

const receiptSchema = new mongoose.Schema(
    {
        zonehead: { type: mongoose.Schema.Types.ObjectId, ref: 'Zone', required: true },
        name: { type: String, required: true },
        phone: { type: String, required: false },
        amount: { type: String, required: true },
        payment: { type: String, required: true },
        paymenttype: { type: String, required: true },
    },
    { timestamps: true }
);



module.exports = mongoose.model('Receipt', receiptSchema);
