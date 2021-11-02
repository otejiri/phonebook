const mongoose = require("mongoose");

const Schema = mongoose.Schema;

const AddressSchema = new Schema({
  _id: false,
  city: String,
  street: String,
  houseNumber: String,
});

const phoneSchema = new Schema({
  _id: false,
  work: String,
  home: String,
  mobile: {
    type: String,
    required: true,
  },
  other: String,
});

const contactSchema = new Schema({
  name: {
    type: String,
    required: true,
  },
  phone: phoneSchema,
  email: {
    type: String,
    required: true,
  },
  address: AddressSchema,
});

module.exports = mongoose.model("Contact", contactSchema);
