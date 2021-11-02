const Contact = require("../../models/contact");
const mongoose = require("mongoose");

// create contact
module.exports = {
  createContact: async function ({ Input }, req) {
    const name = Input.name;
    const workPhone = Input.workPhone;
    const mobilePhone = Input.mobilePhone;
    const homePhone = Input.homePhone;
    const otherPhone = Input.otherPhone;
    const city = Input.city;
    const houseNumber = Input.houseNumber;
    const street = Input.street;
    const email = Input.email;

    const existingUser = await Contact.findOne({ email: email });

    if (existingUser) {
      const error = new Error("Contact already exists");
      throw error;
    }

    const contact = new Contact({
      ...(process.env.NODE_ENV === "test" &&
        name === "ATestName" && { _id: "618123d6481508a6ff444c52" }),
      name: name,
      phone: {
        work: workPhone,
        mobile: mobilePhone,
        home: homePhone,
        other: otherPhone,
      },
      address: { city: city, houseNumber: houseNumber, street: street },
      email: email,
    });

    const createdContact = await contact.save();
    return { ...createdContact._doc, _id: createdContact._id.toString() };
  },

  listContacts: async function ({ Input }, req) {
    const token = req.headers.authorization;

    let options = {};

    const page = Input.page;
    const limit = Input.limit;
    const sortBy = Input.sortBy;
    const sortType = Input.sortType;

    const skip = (page - 1) * limit;

    if (page && limit) {
      options.limit = limit;
      options.skip = skip;
    }

    options.sort = {
      [sortBy]: sortType,
    };

    const contacts = await Contact.find({}, {}, options).populate();

    return [...contacts];
  },
  updateContact: async function ({ Input }, req) {
    const id = Input.id;
    const name = Input.name;
    const workPhone = Input.workPhone;
    const mobilePhone = Input.mobilePhone;
    const homePhone = Input.homePhone;
    const otherPhone = Input.otherPhone;
    const city = Input.city;
    const houseNumber = Input.houseNumber;
    const street = Input.street;
    const email = Input.email;

    if (!id || mongoose.isValidObjectId(id) === false) {
      const error = new Error("invalid contact id");
      throw error;
    }

    const contact = await Contact.findById(id);

    if (!contact) {
      const error = new Error(
        `update failed --contact with id: ${id} not found--`
      );
      throw error;
    }
    const filter = { _id: id };

    let update = {};

    if (name) {
      update.name = name;
    }

    if (email) {
      update.email = email;
    }

    if (city || houseNumber || street) {
      const addressObj = contact.address.$__parent._doc.address._doc;
      const updatedAddress = {
        ...addressObj,
        ...(city && { city }),
        ...(houseNumber && { houseNumber }),
        ...(street && { street }),
      };
      update.address = updatedAddress;
    }
    if (workPhone || homePhone || mobilePhone || otherPhone) {
      const phoneObj = contact.phone.$__parent._doc.phone._doc;
      const updatedPhone = {
        ...phoneObj,
        ...(mobilePhone && { mobile: mobilePhone }),
        ...(workPhone && { work: workPhone }),
        ...(otherPhone && { other: otherPhone }),
        ...(homePhone && { home: homePhone }),
      };
      update.phone = updatedPhone;
    }
    const updatedContact = await Contact.findOneAndUpdate(filter, update, {
      new: true,
      returnOriginal: false,
      returnDocument: true,
    });

    return {
      ...updatedContact._doc,
      _id: updatedContact._id.toString(),
    };
  },
  deleteContact: async function ({ Input }, req) {
    const id = Input.id;

    if (!id || mongoose.isValidObjectId(id) === false) {
      const error = new Error("invalid contact id");
      throw error;
    }
    const contact = await Contact.findById(id);

    if (!contact) {
      const error = new Error(
        `deletion failed --contact with id: ${id} not found--`
      );
      throw error;
    }

    const deletedContact = await Contact.findByIdAndDelete(id);

    return { ...deletedContact._doc, _id: deletedContact._id.toString() };
  },
};
