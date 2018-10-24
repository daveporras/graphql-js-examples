const axios = require('axios');
const graphql = require('graphql');

const {
  GraphQLObjectType, GraphQLString, GraphQLInt, GraphQLSchema, GraphQLList, GraphQLNonNull,
} = graphql;

const CompanyType = new GraphQLObjectType({
  name: 'Company',
  // Éstos serán los campos que podrán ser consultados en las queries.
  fields: () => ({ // Field debería contener un function closure para resolver conflictos con variables llamadas antes de ser declaradas.
    // Cada campo debe estar definido por el tipo de dato que ésta almacenará.
    id: {
      type: GraphQLString,
    },
    name: {
      type: GraphQLString,
    },
    description: {
      type: GraphQLString,
    },
    // Aqui se anida otra estructura de schema que podrá ser usado si el campo siguiente es solicitado en la query.
    users: {
      type: new GraphQLList(UserType), // Se hace uso de GraphQLList para mostrar resultados de tipo arreglo (lista).
      resolve(parentValue, args) {
        console.log(parentValue)
        return axios.get(`http://localhost:6000/companies/${parentValue.id}/users`).then(response => response.data);
      },
    },
  }),
});

const UserType = new GraphQLObjectType({
  name: 'User',
  fields: () => ({
    id: { type: GraphQLString },
    firstName: { type: GraphQLString },
    age: { type: GraphQLInt },
    company: {
      type: CompanyType,
      resolve(parentValue, args) {
        return axios.get(`http://localhost:6000/companies/${parentValue.companyId}`).then(response => response.data);
      },
    },
  }),
});

// La root query representa una especia de resumen o raíz de todas las consultas que podrán ser realizadas en todo el schema.
const RootQuery = new GraphQLObjectType({
  name: 'RootQueryType',
  fields: {
    user: {
      type: UserType,
      args: {
        id: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:6000/users/${args.id}`).then(response => response.data);
      },
    },
    company: {
      type: CompanyType,
      args: {
        id: {
          type: GraphQLString,
        },
      },
      resolve(parentValue, args) {
        return axios.get(`http://localhost:6000/companies/${args.id}`).then(response => response.data);
      },
    },
  },
});

// La mutation se escarga de la inseción, modificación y eliminación de datos.
const mutation = new GraphQLObjectType({
  name: 'Mutation',
  fields: {
    addUser: { // Inserción.
      type: UserType,
      args: {
        firstName: { type: new GraphQLNonNull(GraphQLString) }, // GraphQLNonNull se encarga de validar que el argumento no sea nulo.
        age: { type: new GraphQLNonNull(GraphQLInt) },
        companyId: { type: GraphQLString },
      },
      resolve(parentValue, args) {
        return axios.post('http://localhost:6000/users', { firstName: args.firstName, age: args.age }).then(response => response.data);
      },
    },
    deleteUser: { // ELiminación.
      type: UserType,
      args: {
        id: {
          type: new GraphQLNonNull(GraphQLString),
        },
      },
      resolve(parentValue, args) {
        return axios.delete(`http://localhost:6000/users/${args.id}`).then(response => response.data);
      },
    },
  },
});

module.exports = new GraphQLSchema({
  query: RootQuery,
  mutation,
});
