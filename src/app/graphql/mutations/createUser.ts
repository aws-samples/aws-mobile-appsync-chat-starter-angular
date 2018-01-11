import gql from 'graphql-tag';

export default gql`
mutation createUser($username: String,!$id: String!) {
  createUser(username: $username, id: $id ) {
    __typename
    cognitoId
    username
    id
  }
}`;
