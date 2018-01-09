import gql from 'graphql-tag';

export default gql`
  fragment user on User {
    id
    cognitoId
    username
  }`;
