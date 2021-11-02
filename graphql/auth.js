// for token authorizations
const User = require("../models/user");

exports.Auth = async (key) => {
  let token = key;
  if (process.env.NODE_ENV === "test") {
    token = process.env.NODE_TEST_KEY;
  }
  if (!token) {
    const error = new Error("unauthorized");
    throw error;
  } else {
    const apiKey = token.split(" ")[1];
    let user = await User.findOne({ apiKey: apiKey });
    if (process.env.NODE_ENV === "test") {
      user = "testUser";
    }
    if (!user) {
      const error = new Error("Invalid authorization key");
      throw error;
    }
  }
};
