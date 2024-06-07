const Payment = require("../modelSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

const createIntent = async (req, res) => {
    const { amount, currency } = req.body;

    if (!amount || !currency) {
        return res.status(400).json({ error: 'Amount and currency are required' });
    }

    try {
        const paymentIntent = await stripe.paymentIntents.create({
            amount,
            currency,
            capture_method: 'manual'
        });

        const newPaymentIntent = new Payment({
            stripeId: paymentIntent.id,
            amount,
            currency,
            status: paymentIntent.status
        });
        await newPaymentIntent.save();
        res.json(paymentIntent);
    } catch (error) {
        console.error('Error creating payment intent:', error);
        res.status(500).json({ error: error.message });
    }
}

const captureIntent = async (req, res) => {
    const { id } = req.params;
    try {
        const paymentIntent = await stripe.paymentIntents.capture(id);
        // Update MongoDB
        await Payment.findOneAndUpdate({ stripeId: id }, { status: paymentIntent.status });
        res.json(paymentIntent);
    } catch (error) {
        console.error('Error capturing payment intent:', error);
        res.status(500).json({ error: error.message });
    }
}

const createRefund = async (req, res) => {
    const { id } = req.params;
    try {
        const paymentIntent = await stripe.paymentIntents.retrieve(id);

        if (paymentIntent.status !== 'succeeded') {
            return res.status(400).json({ error: 'PaymentIntent must be successfully charged before creating a refund' });
        }
        const refund = await stripe.refunds.create({ payment_intent: id });
        res.json(refund);
    } catch (error) {
        console.error('Error creating refund:', error);
        res.status(500).json({ error: error.message });
    }
}

const getAllPay = async (req, res) => {
    try {
        const paymentIntents = await Payment.find();
        res.json(paymentIntents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createIntent, captureIntent, createRefund, getAllPay }