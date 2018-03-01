type Conversation = {
    // A unique identifier for the Conversation.
    id: string,
    // The Conversation's name.
    name: string,
    // The Conversation's timestamp.
    createdAt?: string | null,
  };

export default Conversation;
