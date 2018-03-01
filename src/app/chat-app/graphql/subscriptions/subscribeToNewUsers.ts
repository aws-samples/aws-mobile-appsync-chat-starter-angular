import gql from 'graphql-tag';

export default gql`
subscription subscribeToNewUsers {
  subscribeToNewUsers {
    __typename
    id
    cognitoId
    username
  }
}`;
