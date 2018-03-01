import gql from 'graphql-tag';

export default gql`
subscription subscribeToNewUCs($userId: ID!) {
  subscribeToNewUCs(userId: $userId) {
    __typename
    userId
    conversationId
    conversation {
      __typename
      id
      name
    }
    associated {
      __typename
      userId
    }
  }
}`;
