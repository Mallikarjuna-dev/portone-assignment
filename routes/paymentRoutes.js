// routes/paymentRoutes.js
/**
 * @swagger
 * components:
 *   schemas:
 *     PaymentIntent:
 *       type: object
 *       required:
 *         - stripeId
 *         - amount
 *         - currency
 *       properties:
 *         stripeId:
 *           type: string
 *           description: The Stripe ID of the payment intent
 *         amount:
 *           type: number
 *           description: The amount of the payment intent
 *         currency:
 *           type: string
 *           description: The currency of the payment intent
 *         status:
 *           type: string
 *           description: The status of the payment intent
 *         createdAt:
 *           type: string
 *           format: date-time
 *           description: The creation date of the payment intent
 *       example:
 *         stripeId: "pi_1F9vhuE2MMEqr7boZalZbZtS"
 *         amount: 2000
 *         currency: "usd"
 *         status: "requires_capture"
 *         createdAt: "2023-06-06T18:32:44.000Z"
 */

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: The payment managing API
 */

const express = require("express");
const { createIntent, captureIntent, createRefund, getAllPay } = require("../controllers/paymentController");
const router = express.Router();

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
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.route("/create_intent").post(createIntent);

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
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.route("/capture_intent/:id").post(captureIntent);

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
 *         description: Bad request
 *       500:
 *         description: Internal server error
 */
router.route("/create_refund/:id").post(createRefund);

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
 *         description: Internal server error
 */
router.route("/get_intents").get(getAllPay);

module.exports = router;
