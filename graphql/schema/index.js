const userSchema = require("./user");
const { mergeSchemas } = require("@graphql-tools/schema");
const schemas = [userSchema];
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
