// src/schemas/UserSchema.js
const { gql } = require('apollo-server-express');

const typeDefs = gql`
  type User {
    id: ID!
    fullName: String!
    age: Int!
    address: String!
    email: String!
    contactNumber: String!
    username: String!
  }

  type Query {
    getUsers: [User]
  }

  type Mutation {
    addUser(
      fullName: String!, 
      age: Int!, 
      address: String!, 
      email: String!, 
      contactNumber: String!, 
      username: String!, 
      password: String!
    ): User

    updateUser(
      id: ID!, 
      fullName: String, 
      age: Int, 
      address: String, 
      email: String, 
      contactNumber: String, 
      username: String, 
      password: String
    ): User

    deleteUser(id: ID!): User
  }
`;

module.exports = typeDefs;
