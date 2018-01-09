import gql from 'graphql-tag';

export default gql`
query getConversationMessages($conversationId: ID!, $after: String, $first: Int) {
  allMessageConnection(conversationId: $conversationId, after: $after, first: $first) {
    __typename
    nextToken,
    messages {
      __typename
      id
      conversationId
      content
      createdAt
      sender
      isSent
    }
  }
}`;
