const { mergeResolvers } = require("@graphql-tools/merge");
const userResolver = require("./user");

const resolvers = [userResolver];

module.exports = mergeResolvers(resolvers);
