const mongoose = require("mongoose");
require("dotenv").config();

// Connect to the MongoDB database
mongoose.connect(
  `${
    process.env.MONGODB_URI || "mongodb://127.0.0.1:27017/googlebooks"
  }?retryWrites=false`,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  }
);

module.exports = mongoose.connection; // Export the Mongoose connection object
