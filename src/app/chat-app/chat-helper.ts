import * as update from 'immutability-helper';
import {
  getConversationMessagesQuery as MessagesQuery,
  getUserConversationConnectionThroughUserQuery as ConvosQuery,
  getAllUsersQuery as UsersQuery
 } from './graphql/operation-result-types';
import Message from './types/message';
import UserConversation from './types/userConversation';
import User from './types/user';

import * as _ from 'lodash';

export const constants = {
  conversationFirst: 10,
  messageFirst: 10
};

export function unshiftMessage(data: MessagesQuery, message: Message): MessagesQuery {
  if (!data || !_.has(data, 'allMessageConnection.messages')) {
    return {
      allMessageConnection: {
        nextToken: null,
        __typename: 'MessageConnection',
        messages: []
      }
    };
  }

  if (data.allMessageConnection.messages.some(m => m.id === message.id)) {
    return data;
  }

  return update(data, {
    allMessageConnection: {
      messages: {$unshift: [message]}
    }
  });
}

export function pushMessages(data: MessagesQuery, messages: Message[], nextToken: string): MessagesQuery {
  if (!data || !_.has(data, 'allMessageConnection.messages')) {
    return {
      allMessageConnection: {
        nextToken: null,
        __typename: 'MessageConnection',
        messages: []
      }
    };
  }

  return update(data, {
    allMessageConnection: {
      messages: {$push: messages},
      nextToken: {$set: nextToken}
    }
  });
}


export function addConversation(data: ConvosQuery, uc: UserConversation): ConvosQuery {
  if (!data || !_.has(data, 'me.conversations.userConversations')) {
    return {
      me: {
        conversations: {
          nextToken: null,
          __typename: 'UserConverstationsConnection',
          userConversations: []
        }
      }
    };
  }

  if (data.me.conversations.userConversations.some(_uc => uc.conversationId === _uc.conversationId)) {
    return data;
  }

  return update(data, {
    me: { conversations: { userConversations: {$push: [uc]}} }
  });
}
export function addUser(data: UsersQuery, user: User): UsersQuery {
  if (!data || !data.allUser) {
    return { allUser: [] };
  }

  if (data.allUser.some(_user => _user.id === user.id)) {
    return data;
  }

  return update(data, {allUser: {$push: [user]}});
}
