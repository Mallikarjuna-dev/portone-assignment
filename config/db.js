const mongoose = require("mongoose");

const connectDB = async () => {
    try {
        const db = mongoose.connect(process.env.MONGODB_URL, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        })
        console.log(`mongodb connected :${db.connection.host}`.cyan.underline);
    } catch (error) {
        console.log(`mongodb connection error: ${error.message}`.red.bold);
        process.exit(1);
    }
};

module.exports = connectDB;