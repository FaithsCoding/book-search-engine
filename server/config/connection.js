const mongoose = require("mongoose");
require("dotenv").config();

// Connect to the MongoDB database
mongoose.connect(
  process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks", // Use the provided MONGODB_URI environment variable if available, otherwise use the local MongoDB URL
  {
    useNewUrlParser: true, // Use the new URL parser
    useUnifiedTopology: true, // Use the new server discovery and monitoring engine
  }
);

module.exports = mongoose.connection; // Export the Mongoose connection object
