const express = require("express");
const router = express.Router();

router.route("/create_intent").post(accessChat);
router.route("/capture_intent/:id").post(fetchChats);
router.route("/create_refund/:id").post(createGroupChat);
router.route("/get_intents").get(renameGroup);

module.exports = router;