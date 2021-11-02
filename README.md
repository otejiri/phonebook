# phonebook

Contact Directory

# DEV

- mocha
- chai
- chai-http
- nodemon

# Core

- graphql
- express
- hat
- express-graphql

## Mutations

```
  createApiUser(Input: {username: "sssssnow"})
  {
      apiKey
  }

 createContact(Input: {name: "fon", mobilePhone: "sfdf", email: "gdfgl@essmal.com",city: "salford", street: "blue", houseNumber: "1412"})
  {
   _id name phone
   {
    mobile
   }
   email address {city}
  }
deleteContact(Input: {id: "61806856b184e91f4969bcbb"})
  {
      email
  }
updateContact(Input: {id: "618123d6481508a6ff444c52", name: "New Juicey", mobilePhone: "08066908766",  street: "willi"})
  {
      name address {city} phone {mobile work other}
  }
```

## Query

List all contacts

```
query  {
  listContacts(Input: {}) {
    name, phone {mobile}
  }
}
```

## Pagination and sorting

```
query  {
  listContacts(Input: {page: 1, limit: 2, sortBy: "name", sortType: -1}) {
    name, phone {mobile}
  }
}
```
