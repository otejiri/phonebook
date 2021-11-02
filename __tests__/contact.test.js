const chai = require("chai");
const chaiHttp = require("chai-http");
chai.use(chaiHttp);
const expect = chai.expect;

const mongoose = require("mongoose");
const Contact = require("../models/contact");

// to ensure env vars work
require("dotenv").config();

// setting the env to testing environment
process.env.NODE_ENV = "test";

app = require("../app");

// after testing block
after(async function () {
  // delete all users from database after testing
  await Contact.deleteMany({}).then(() => {
    // set env to null after running tests
    process.env.NODE_ENV = null;
  });
});

describe("creating contact", () => {
  it("it should return return user name, mobile, city", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `mutation {
                        createContact(Input: {name: "testName", mobilePhone: "08000", email: "test@test.com",city: "salford", street: "deansgate", houseNumber: "1412"}) {
                            name phone {
                              mobile
                            } email address {city}
                          }
                  }`,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.createContact.name).to.equal("testName");
        expect(res.body.data.createContact.address.city).to.equal("salford");
        expect(res.body.data.createContact.phone.mobile).to.equal("08000");
        done();
      });
  });

  it("it should return status 500 if creating an existing contact", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `mutation {
                        createContact(Input: {name: "testName", mobilePhone: "08000", email: "test@test.com",city: "salford", street: "deansgate", houseNumber: "1412"}) {
                            name phone {
                              mobile
                            } email address {city}
                          }
                  }`,
      })
      .end((err, res) => {
        expect(res).to.have.status(500);
        expect(res.body.errors[0].message).to.equal("Contact already exists");
        done();
      });
  });

  it("it should add if new email", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `mutation {
                        createContact(Input: {name: "ATestName", mobilePhone: "08000", email: "xtest@test.com",city: "London", street: "Green", houseNumber: "1412"}) {
                            _id name phone {
                              mobile
                            } email address {city}
                          }
                  }`,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.createContact.name).to.equal("ATestName");
        done();
      });
  });
});

describe("list contacts", () => {
  it("it should list all contacts", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `query {
            listContacts(Input: {}) {
                name
              }
                  }`,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.listContacts).to.have.lengthOf(2);

        done();
      });
  });

  it("it should paginate and return 1 result", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `query {
            listContacts(Input: {page: 2, limit: 1}) {
                name
              }
                  }`,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.listContacts).to.have.lengthOf(1);
        done();
      });
  });

  it("it should sort by name", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `query {
            listContacts(Input: {sortBy: "name", sortType: -1}) {
                name
              }
                  }`,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.listContacts[0].name).to.equal("testName");
        done();
      });
  });

  it("it should sort by street", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `query {
            listContacts(Input: {sortBy: "email", sortType: -1}) {
                name
              }
                  }`,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.listContacts[0].name).to.equal("ATestName");
        done();
      });
  });
});

describe("update and delete contacts", () => {
  it("it should update contact name", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `mutation {
            updateContact(Input: {id: "618123d6481508a6ff444c52", name: "updatedTest"}) {
                name
              }
            
                  }`,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.updateContact.name).to.equal("updatedTest");
        // expect(res.body.data.listContacts[0].name).to.equal("updatedTest");

        done();
      });
  });
  it("it should delete contact", (done) => {
    chai
      .request(app)
      .post("/graphql")
      .send({
        query: `mutation {
            deleteContact(Input: {id: "618123d6481508a6ff444c52"}) {
                _id
              }
            
                  }`,
      })
      .end((err, res) => {
        expect(res).to.have.status(200);
        expect(res.body.data.deleteContact._id).to.equal(
          "618123d6481508a6ff444c52"
        );
        done();
      });
  });
});
