import gql from 'graphql-tag';

export default gql`
query getMe {
  me {
    __typename
    id
    cognitoId
    username
    registered
  }
}`;
