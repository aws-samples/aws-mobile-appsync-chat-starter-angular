import Conversation from './conversation';

type UserConversation = {
  userId: string,
  conversationId: string,
  conversation?: Conversation | null
};

export default UserConversation;
