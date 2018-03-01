/* tslint:disable */
//  This file was automatically generated and should not be edited.

export type createConversationMutationVariables = {
  id: string,
  name: string,
  createdAt?: string | null,
};

export type createConversationMutation = {
  // Create a Conversation. Use some of the cooked in template functions for UUID and DateTime.
  createConversation:  {
    __typename: "Conversation",
    // A unique identifier for the Conversation.
    id: string,
    // The Conversation's name.
    name: string,
    // The Conversation's timestamp.
    createdAt: string | null,
  } | null,
};

export type createMessageMutationVariables = {
  id: string,
  content?: string | null,
  conversationId: string,
  createdAt: string,
};

export type createMessageMutation = {
  // Create a message in a Conversation.
  createMessage:  {
    __typename: "Message",
    // The id of the Conversation this message belongs to. This is the table primary key.
    conversationId: string,
    // The message timestamp. This is also the table sort key.
    createdAt: string | null,
    // Generated id for a message -- read-only
    id: string,
    sender: string | null,
    // The message content.
    content: string,
    // Flag denoting if this message has been accepted by the server or not.
    isSent: boolean | null,
  } | null,
};

export type createUserMutationVariables = {
  username: string,
};

export type createUserMutation = {
  // Put a single value of type 'User'. If an item does not exist with the same key the item will be created. If there exists an item at that key already, it will be updated.
  createUser:  {
    __typename: "User",
    // A unique identifier for the user.
    cognitoId: string,
    // The username
    username: string,
    // Generated id for a user. read-only
    id: string,
  } | null,
};

export type createUserConversationsMutationVariables = {
  conversationId: string,
  userId: string,
};

export type createUserConversationsMutation = {
  // Put a single value of type 'UserConversations'. If an item does not exist with the same key the item will be created. If there exists an item at that key already, it will be updated.
  createUserConversations:  {
    __typename: "UserConversations",
    userId: string,
    conversationId: string,
    conversation:  {
      __typename: "Conversation",
      // A unique identifier for the Conversation.
      id: string,
      // The Conversation's name.
      name: string,
    } | null,
  } | null,
};

export type getAllUsersQuery = {
  // Scan through all values of type 'User'. Use the 'after' and 'before' arguments with the 'nextToken' returned by the 'UserConnection' result to fetch pages.
  allUser:  Array< {
    __typename: "User",
    // Generated id for a user. read-only
    id: string,
    // A unique identifier for the user.
    cognitoId: string,
    // The username
    username: string,
    // registered?
    registered: boolean
  } | null > | null,
};

export type getConversationMessagesQueryVariables = {
  conversationId: string,
  after?: string | null,
  first?: number | null,
};

export type getConversationMessagesQuery = {
  // Scan through all values of type 'MessageConnection'. Use the 'after' and 'before' arguments with the 'nextToken' returned by the 'MessageConnectionConnection' result to fetch pages.
  allMessageConnection:  {
    __typename: "MessageConnection",
    nextToken: string | null,
    messages:  Array< {
      __typename: "Message",
      // Generated id for a message -- read-only
      id: string,
      // The id of the Conversation this message belongs to. This is the table primary key.
      conversationId: string,
      // The message content.
      content: string,
      // The message timestamp. This is also the table sort key.
      createdAt: string | null,
      sender: string | null,
      // Flag denoting if this message has been accepted by the server or not.
      isSent: boolean | null,
    } | null > | null,
  } | null,
};

export type getUserConversationConnectionThroughUserQueryVariables = {
  after?: string | null,
  first?: number | null,
};

export type getUserConversationConnectionThroughUserQuery = {
  // Get my user.
  me:  {
    // A user's enrolled Conversations. This is an interesting case. This is an interesting pagination case.
    conversations:  {
      __typename: "UserConverstationsConnection",
      nextToken: string | null,
      userConversations:  Array< {
        __typename: "UserConversations",
        conversationId: string,
        conversation:  {
          __typename: "Conversation",
          // A unique identifier for the Conversation.
          id: string,
          // The Conversation's name.
          name: string,
        } | null,
      } | null > | null,
    } | null,
  } | null,
};

export type subscribeToNewMessageSubscriptionVariables = {
  conversationId: string,
};

export type subscribeToNewMessageSubscription = {
  // Subscribes to all new messages in a given Conversation.
  subscribeToNewMessage:  {
    __typename: "Message",
    // The id of the Conversation this message belongs to. This is the table primary key.
    conversationId: string,
    // The message timestamp. This is also the table sort key.
    createdAt: string | null,
    // Generated id for a message -- read-only
    id: string,
    sender: string | null,
    // The message content.
    content: string,
    // Flag denoting if this message has been accepted by the server or not.
    isSent: boolean | null,
  } | null,
};

export type userFragment = {
  // Generated id for a user. read-only
  id: string,
  // A unique identifier for the user.
  cognitoId: string,
  // The username
  username: string,
};
