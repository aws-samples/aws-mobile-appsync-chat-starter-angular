import gql from 'graphql-tag';

export default gql`
query getUserConversationConnectionThroughUser($after: String, $first: Int) {
  me {
    id
    registered
    __typename
    conversations(first: $first, after: $after) {
      __typename
      nextToken
      userConversations {
        __typename
        userId
        conversationId
        associated {
          __typename
          userId
        }
        conversation {
          __typename
          id
          name
        }
      }
    }
  }
}`;
