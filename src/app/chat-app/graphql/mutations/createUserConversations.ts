import gql from 'graphql-tag';

export default gql`
mutation createUserConversations($conversationId: ID!, $userId: ID!) {
  createUserConversations(conversationId: $conversationId, userId: $userId) {
    __typename
    userId
    conversationId
  }
}
`;
