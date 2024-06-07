const express = require('express');
require("dotenv").config();
const stripe = require("stripe")(process.env.STRIPE_SECRET_KEY)

const connectDB = require("./config/db");

const port = process.env.PORT || 3000;

connectDB(); //connection to the mongo

const app = express();

app.use(express.json()); // to eccept json data

app.use("/api/v1", require("./routes/paymentRoutes"));

app.listen(
    port,
    console.log(`server listening on port: ${port}`)
);