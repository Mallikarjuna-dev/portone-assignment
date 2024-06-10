// controllers/paymentController.js
const Payment = require("../modelSchema");
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY);

/**
 * @swagger
 * components:
 *   responses:
 *     BadRequest:
 *       description: Bad request
 *     InternalServerError:
 *       description: Internal server error
 */

/**
 * @swagger
 * /create_intent:
 *   post:
 *     summary: Create a payment intent
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - amount
 *               - currency
 *             properties:
 *               amount:
 *                 type: number
 *               currency:
 *                 type: string
 *             example:
 *               amount: 2000
 *               currency: "usd"
 *     responses:
 *       200:
 *         description: The payment intent was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntent'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /capture_intent/{id}:
 *   post:
 *     summary: Capture a payment intent
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment intent ID
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               payment_method:
 *                 type: string
 *             example:
 *               payment_method: "pm_card_visa"
 *     responses:
 *       200:
 *         description: The payment intent was captured successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/PaymentIntent'
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
const captureIntent = async (req, res) => {
    const { id } = req.params;
    const { payment_method } = req.body;

    try {
        let paymentIntent = await stripe.paymentIntents.retrieve(id);

        if (paymentIntent.status === 'requires_payment_method') {
            if (!payment_method) {
                return res.status(400).json({ error: 'Payment method is required' });
            }
            paymentIntent = await stripe.paymentIntents.confirm(id, {
                payment_method
            });
        }

        if (paymentIntent.status === 'requires_capture') {
            paymentIntent = await stripe.paymentIntents.capture(id);
            await Payment.findOneAndUpdate({ stripeId: id }, { status: paymentIntent.status });
        }

        res.json(paymentIntent);
    } catch (error) {
        console.error('Error capturing payment intent:', error);
        res.status(500).json({ error: error.message });
    }
}

/**
 * @swagger
 * /create_refund/{id}:
 *   post:
 *     summary: Create a refund for a payment intent
 *     tags: [Payments]
 *     parameters:
 *       - in: path
 *         name: id
 *         schema:
 *           type: string
 *         required: true
 *         description: The payment intent ID
 *     responses:
 *       200:
 *         description: The refund was created successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 id:
 *                   type: string
 *                   description: The refund ID
 *       400:
 *         $ref: '#/components/responses/BadRequest'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
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

/**
 * @swagger
 * /get_intents:
 *   get:
 *     summary: Get a list of all payment intents
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of payment intents
 *         content:
 *           application/json:
 *             schema:
 *               type: array
 *               items:
 *                 $ref: '#/components/schemas/PaymentIntent'
 *       500:
 *         $ref: '#/components/responses/InternalServerError'
 */
const getAllPay = async (req, res) => {
    try {
        const paymentIntents = await Payment.find();
        res.json(paymentIntents);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
}

module.exports = { createIntent, captureIntent, createRefund, getAllPay }
