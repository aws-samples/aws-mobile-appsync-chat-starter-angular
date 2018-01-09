import gql from 'graphql-tag';

export default gql`
query getAllUsers {
  allUser {
    __typename
    id
    cognitoId
    username
  }
}`;
