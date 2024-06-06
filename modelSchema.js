const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
    {
        stripeId: { type: String, required: true, unique: true },
        amount: { type: Number, required: true },
        currency: { type: Number, required: true },
        status: { type: Number, required: true },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("Payment", paymentSchema);