const mongoose = require("mongoose");

const paymentSchema = mongoose.Schema(
    {
        stripeId: { type: String, required: true, unique: true },
        amount: { type: Number, required: true },
        currency: { type: String, required: true },
        status: {
            type: String, default: "success",
        },
        createdAt: { type: Date, default: Date.now },
    },
    {
        timestamps: true,
    }
);

module.exports = mongoose.model("PaymentIntent", paymentSchema);