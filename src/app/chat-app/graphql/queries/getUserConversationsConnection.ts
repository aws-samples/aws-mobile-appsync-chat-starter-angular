import gql from 'graphql-tag';

export default gql`
query getUserConversationConnectionThroughUser($after: String, $first: Int) {
  me {
    conversations(first: $first, after: $after) {
      __typename
      nextToken
      userConversations {
        __typename
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
