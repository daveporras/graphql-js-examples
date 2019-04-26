const { ApolloServer, gql } = require('apollo-server');
const db = require('./db');
const typeDefs = require('./schema');

const resolvers = {
  User: {
    company: (parentValues, args) => {
      console.log(parentValues);
      return db.companies.find(({ id }) => id === parentValues.companyId)
    }
  },
  Company: {
    users: (parentValues, args) => {
      console.log(parentValues);
      return db.users.filter(({ companyId }) => companyId === parentValues.id);
    }
  },
  Query: {
    user: (root, params) => {
      console.log(params);
      return db.users.find(({ id }) => id === params.id)
    },
    company: (root, params) => db.companies.find(({ id }) => id === params.id)
  }
}

const server = new ApolloServer({ typeDefs, resolvers });

server.listen().then(({ url }) => console.log(`🚀  Server ready at ${url}`));
