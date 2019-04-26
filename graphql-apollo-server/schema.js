const typeDefs = gql`
  type Company {
    id: String,
    name: String,
    description: String,
    users: [User]
  }

  type User {
    id: String,
    firstName: String,
    age: Int,
    companyId: String,
    company: Company
  }

  type Query {
    user(id: String): User,
    company(id: String): Company
  }
`;

module.exports = typeDefs;
