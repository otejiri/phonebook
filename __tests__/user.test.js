const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;

const mongoose = require("mongoose");
const User = require("../models/user");

// to ensure env vars work
require("dotenv").config();

// setting the env to testing environment
process.env.NODE_ENV = "test";

app = require("../app");

before(async () => {
  process.env.NODE_TEST_KEY = "test";
  mongoose
    .connect(process.env.MONGODB_URI_TEST)
    .then((result) => {})
    .catch((error) => {
      console.log(error);
    });
});
// after testing block
after(async function () {
  // delete all users from database after testing
  await User.deleteMany({}).then(() => {
    // set env to null after running tests
    process.env.NODE_ENV = null;
    // calling the disconnect function to end test, this is done only once and not repeated in any other test file
    return mongoose.disconnect();
  });
});

describe("creating api user test", () => {
  it("it should return api key on user creation", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `mutation {
          createApiUser(Input: {username: "testuser"}) {
            apiKey
          }
        }`,
      })
      .end((err, res) => {
        // expecting ok on user creation
        expect(res).to.have.status(200);
        // expecting api key to be a long string
        expect(res.body.data.createApiUser.apiKey).to.have.length.greaterThan(
          4
        );
        done();
      });
  });
  it("it should return status 500 if username exist", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `mutation {
          createApiUser(Input: {username: "testuser"}) {
            apiKey
          }
        }`,
      })
      .end((err, res) => {
        // exprecting creation to fail because username is already taken
        expect(res).to.have.status(500);
        expect(res.body.errors[0].message).to.equal("Api user already exists");
        done();
      });
  });
});
