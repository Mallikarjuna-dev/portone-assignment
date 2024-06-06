const express = require('express');
const dotenv = require("dotenv").config();

const connectDB = require("./config/db");

const port = process.env.PORT || 5000;

connectDB(); //connection to the mongo

const app = express();

app.use(express.json()); // to eccept json data

app.use("/api/vi", require("./routes/userRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));


const server = app.listen(
    port,
    console.log(`server listening on port: ${port}`.yellow.bold)
  );