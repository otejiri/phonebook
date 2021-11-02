const userSchema = require("./user");
const contactSchema = require("./contact");

const { mergeSchemas } = require("@graphql-tools/schema");

const schemas = [userSchema, contactSchema];

module.exports = mergeSchemas({
  schemas: schemas,
  typeDefs: `
      type ExtraType {
        foo: String
      }
    `,
  resolvers: {
    ExtraType: {
      foo: () => "FOO",
    },
  },
});
