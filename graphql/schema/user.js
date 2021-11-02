const { buildSchema } = require("graphql");

// rootquery set to test is for graphiql to work for now
// this schema is to create api user who will be privy to query database

module.exports = buildSchema(`
type ApiUser {
    _id: ID!
    username: String!
    apiKey: String!
}

input UserInputData{
    username: String!
}

input Id {
    id: String!
}
type RootMutation {
    createApiUser(Input: UserInputData): ApiUser!
    deleteApiUser(Input: Id): ApiUser!  
}
type RootQuery {
    test: String
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
