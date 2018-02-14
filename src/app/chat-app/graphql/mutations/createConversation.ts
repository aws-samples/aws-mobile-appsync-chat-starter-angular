import gql from 'graphql-tag';

export default gql`
mutation createConversation($id: ID!, $name: String!, $createdAt: String) {
  createConversation(id: $id, name: $name, createdAt: $createdAt) {
    __typename
    id,
    name,
    createdAt
  }
}`;
