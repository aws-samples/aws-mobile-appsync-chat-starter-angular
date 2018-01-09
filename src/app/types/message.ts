type Message = {
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
};

export default Message;
