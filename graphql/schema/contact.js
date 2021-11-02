const { buildSchema } = require("graphql");

// rootquery set to test is for graphiql to work for now
module.exports = buildSchema(`

type PhoneData {
    work: String
    home: String
    mobile: String!
    other: String
}

type AddressData {
    city: String!
    street: String!
    houseNumber: String!
}

type Contact {
    _id: ID!
    name: String!
    phone: PhoneData
    email: String!
    address: AddressData
}
type ContactResponse {
    name: String
    phone: PhoneData
    email: String
    address: AddressData
}
input ContactData {
    _id: ID
    name: String!
    workPhone: String
    homePhone: String
    mobilePhone: String
    otherPhone: String
    email: String!
    city: String!
    street: String!
    houseNumber: String!
}
input UpdateContactData {
    id: String!
    name: String
    workPhone: String
    homePhone: String
    mobilePhone: String
    otherPhone: String
    email: String
    city: String
    street: String
    houseNumber: String
}
input ContactInfo {
    sortBy: String
    sortType: Int
    page: Int
    limit: Int
}
input Id {
    id: String!
}
type RootMutation {

    createContact(Input: ContactData): Contact!
    deleteContact(Input: Id): Contact!
    updateContact(Input: UpdateContactData): Contact!
 
}
type RootQuery {
    listContacts(Input: ContactInfo): [ContactResponse]
}
schema {
    query: RootQuery
    mutation: RootMutation
}
`);
