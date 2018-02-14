import { Component, Input, Output, EventEmitter } from '@angular/core';
import { AppsyncService } from '../appsync.service';

import getAllUsers from '../graphql/queries/getAllUsers';
import createConversation from '../graphql/mutations/createConversation';
import createUserConversations from '../graphql/mutations/createUserConversations';
import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';
import { constants } from '../chat-helper';
import Conversation from '../types/conversation';
import * as _ from 'lodash';
import { v4 as uuid } from 'uuid';

import { Analytics } from 'aws-amplify';

import User from '../types/user';

@Component({
  selector: 'app-chat-user-list',
  templateUrl: './chat-user-list.component.html',
  styleUrls: ['./chat-user-list.component.css']
})
export class ChatUserListComponent {

  _user;
  users: User[] = [];
  order = 'username';
  no_user = false;

  @Input()
  set user(user) {
    this._user = user;
    if (this._user) { this.getAllUsers(); }
  }

  @Output() onNewConvo = new EventEmitter<any>();

  constructor(private appsync: AppsyncService) {}

  getAllUsers() {
    this.appsync.hc().then(client => {
      client.watchQuery({
        query: getAllUsers,
        fetchPolicy: 'cache-and-network',
        ssr: false
      }).subscribe(({data}) => {
        if (!data) {
          return console.log('getAllUsers - no data');
        }
        this.users = _(data.allUser).sortBy('username').reject(['id', this._user.id]).value();
        console.log('getAllUsers - Got data', this.users);
        this.no_user = (this.users.length === 0);
      });
    });
  }

  createNewConversation(user, event) {
    event.stopPropagation();

    this.appsync.hc().then(client => {

      const options = {
        query: getUserConversationsConnection,
        variables: { first: constants.conversationFirst }
      };

      const userConvos = client.readQuery(options);
      const path = 'me.conversations.userConversations';
      const userConvo = _.chain(userConvos).get(path).find(c => _.some(c.associated, ['userId', user.id])).value();

      if (userConvo) {
        return this.onNewConvo.emit(userConvo.conversation);
      }

      const newConvo: Conversation = {
        id: uuid(),
        name: _.map([this._user, user], 'username').sort().join(' and '),
        createdAt: `${Date.now()}`
      };

      client.mutate({
        mutation: createConversation,
        variables: newConvo
      })
      .then(() => createUserConvo(client, user.id, newConvo.id))
      .then(() => createUserConvo(client, this._user.id, newConvo.id, true))
      .then(() => this.onNewConvo.emit(newConvo))
      .catch(err => console.log('create convo error', err));
      Analytics.record('New Conversation');
    });
  }
}

function createUserConvo(client, id, convoId, update = false): Promise<any> {
  const mutationOptions = {
    mutation: createUserConversations,
    variables: { 'userId': id, 'conversationId': convoId }
  };
  if (update) {
    mutationOptions['refetchQueries'] = [{
      query: getUserConversationsConnection,
      variables: { first: constants.conversationFirst }
    }];
  }
  return client.mutate(mutationOptions);
}
