const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const apiUserSchema = new Schema({
  username: {
    type: String,
    required: true,
  },
  apiKey: {
    type: String,
    required: true,
  },
});

module.exports = mongoose.model("User", apiUserSchema);
