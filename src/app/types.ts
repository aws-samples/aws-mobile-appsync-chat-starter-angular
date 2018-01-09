export interface IMessage {
  conversationId: string;
  createdAt: string;
  content: string;
  sender: string;
  isSent?: boolean;
  id?: string;
}

export interface IUser {
  id: string;
  cognitoId: string;
  username: string;
}

export interface IConversation {
  createdAt: string;
  id: string;
  name: string;
  messages?: string[];
}
