const express = require("express");
const mongoose = require("mongoose");

const { graphqlHTTP } = require("express-graphql");
const graphqlSchema = require("./graphql/schema/index.js");
const resolvers = require("./graphql/resolver/index.js");
const app = express();

// configuration to ensure .env variables work
require("dotenv").config();

// set mongoose url for dev or tests, for production this test will need to be set in .env
const env = process.env.NODE_ENV || "development";

if (env === "development") {
  process.env.MONGODB_URI = process.env.MONGODB_URI_DEV;
} else if (env === "test") {
  process.env.MONGODB_URI = process.env.MONGODB_URI_TEST;
} else {
  process.env.MONGODB_URI = process.env.MONGODB_URI_PROD;
}

app.use(
  "/graphql",
  graphqlHTTP({
    schema: graphqlSchema,
    rootValue: resolvers,
    graphiql: true,
  })
);

mongoose.connect(process.env.MONGODB_URI).then((result) => {
  //commented the listen function out because while testing server will attempt to run on the same port, resolved with a server.js file
  //   app.listen(8080);
});
module.exports = app;
