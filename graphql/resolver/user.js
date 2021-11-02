const hat = require("hat");
const User = require("../../models/user");
const mongoose = require("mongoose");

// create api user
module.exports = {
  createApiUser: async function ({ Input }, req) {
    const username = Input.username;
    console.log(username);
    // checking if username already taken
    const existingUser = await User.findOne({ username: username });

    if (existingUser) {
      const error = new Error("Api user already exists");
      throw error;
    }
    // generate api key with hat
    const key = await hat();

    const user = new User({
      username: username,
      apiKey: key,
    });

    const createdApiUser = await user.save();
    return { ...createdApiUser._doc, _id: createdApiUser._id.toString() };
  },

  deleteApiUser: async function ({ Input }, req) {
    const id = Input.id;

    // to see is id a valid mongodb id string
    if (!id || mongoose.isValidObjectId(id) === false) {
      const error = new Error("invalid contact id");
      throw error;
    }

    const user = await User.findById(id);

    if (!user) {
      const error = new Error(
        `deletion failed --user with id: ${id} not found--`
      );
      throw error;
    }

    const deletedUser = await User.findByIdAndDelete(id);

    return { ...deletedUser._doc, _id: deletedUser._id.toString() };
  },
};
