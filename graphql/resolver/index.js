const { mergeResolvers } = require("@graphql-tools/merge");
const userResolver = require("./user");
const contactResolver = require("./contact");

const resolvers = [userResolver, contactResolver];

module.exports = mergeResolvers(resolvers);
