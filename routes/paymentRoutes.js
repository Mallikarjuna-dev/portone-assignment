const express = require("express");
const { createIntent, captureIntent, createRefund, getAllPay } = require("../controllers/paymentController");
const router = express.Router();

router.route("/create_intent").post(createIntent);
router.route("/capture_intent/:id").post(captureIntent);
router.route("/create_refund/:id").post(createRefund);
router.route("/get_intents").get(getAllPay);

module.exports = router;