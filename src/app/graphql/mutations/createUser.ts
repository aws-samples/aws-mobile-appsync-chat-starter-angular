import gql from 'graphql-tag';

export default gql`
mutation createUser($username: String!) {
  createUser(username: $username) {
    __typename
    cognitoId
    username
    id
  }
}`;
