import { Component, Input, ElementRef, ViewChild } from '@angular/core';
import { AppsyncService } from '../appsync.service';
import getConversationMessages from '../graphql/queries/getConversationMessages';
import subscribeToNewMessages from '../graphql/subscriptions/subscribeToNewMessages';
import { getConversationMessagesQuery as MessagesQuery } from '../graphql/operation-result-types';

import Message from '../types/message';

import { ObservableQuery, ApolloQueryResult } from 'apollo-client';

import { unshiftMessage, pushMessages, constants } from '../chat-helper';

import { Observable } from 'rxjs/Observable';
import 'rxjs/add/observable/from';
import 'rxjs/add/observable/empty';

const USER_ID_PREFIX = 'User:';

@Component({
  selector: 'app-chat-message-view',
  templateUrl: './chat-message-view.component.html',
  styleUrls: ['./chat-message-view.component.css']
})
export class ChatMessageViewComponent {

  _conversation;
  messages: Message[] = [];
  nextToken: string;
  fetchingMore = false;
  completedFetching = false;
  observedQuery: ObservableQuery<MessagesQuery>;
  lastMessage: Message;
  firstMessage: Message;
  subscription: () => void;

  @Input()
  set conversation(convo: any) {
    this._conversation = convo;
    this.nextToken = null;
    this.messages = [];
    if (this.subscription) {
      this.subscription();
    }
    this.loadMessages();
  }

  get conversation() { return this._conversation; }

  @Input() senderId;

  @ViewChild('scrollMe') private myScrollContainer: ElementRef;

  constructor(private appsync: AppsyncService) {
    this.loadMoreMessages = this.loadMoreMessages.bind(this);
  }

  messageAdded(isFirst = false, message: Message) {
    if (isFirst) {
      if (!this.firstMessage) {
        this.firstMessage = message;
      } else if (this.firstMessage.id !== message.id) {
        setTimeout(() => {
          this.completedFetching = this.fetchingMore;
          this.fetchingMore = false;
        });
      }
    } else {
      if (!this.lastMessage || this.lastMessage.id !== message.id) {
        this.scrollToBottom();
      }
      this.lastMessage = message;
    }
  }

  scrollToBottom(): void {
    try {
      this.myScrollContainer.nativeElement.scrollTop = this.myScrollContainer.nativeElement.scrollHeight;
    } catch (err) { }
  }

  fromMe(message): boolean { return message.sender === this.senderId; }

  loadMessages(event = null, fetchPolicy = 'cache-and-network') {
    if (event) { event.stopPropagation(); }
    const innerObserable = this.appsync.hc().then(client => {
      console.log('chat-message-view: loadMessages', this._conversation.id, fetchPolicy);
      const options = {
        query: getConversationMessages,
        fetchPolicy: fetchPolicy,
        variables: {
          conversationId: this._conversation.id,
          first: constants.messageFirst
        }
      };

      const observable: ObservableQuery<MessagesQuery> = client.watchQuery(options);

      observable.subscribe(({data}) => {
        console.log('chat-message-view: subscribe', data);
        if (!data) { return console.log('getConversationMessages - no data'); }
        const newMessages = data.allMessageConnection.messages;
        this.messages = [...newMessages].reverse();
        this.nextToken = data.allMessageConnection.nextToken;
        console.log('chat-message-view: nextToken is now', this.nextToken ? 'set' : 'null');
      });

      this.subscription = observable.subscribeToMore({
        document: subscribeToNewMessages,
        variables: { 'conversationId': this._conversation.id },
        updateQuery: (prev: MessagesQuery, {subscriptionData: {data: {subscribeToNewMessage: message }}}) => {
          console.log('subscribeToMore - updateQuery:', message);
          return unshiftMessage(prev, message);
        }
      });
      this.observedQuery = observable;
      return observable;
    });
    return Observable.from(innerObserable);
  }

  loadMoreMessages(event = null) {
    if (event) { event.stopPropagation(); event.preventDefault(); }
    if (!this.nextToken) { return Observable.empty(); }
    const result = this.observedQuery.fetchMore({
      variables : { after: this.nextToken },
      updateQuery: (prev, {fetchMoreResult} ) => {
        if (!fetchMoreResult) { return prev; }
        const _res = pushMessages(prev as MessagesQuery,
          fetchMoreResult.allMessageConnection.messages,
          fetchMoreResult.allMessageConnection.nextToken);
        this.completedFetching = false;
        this.fetchingMore = true;
        return _res;
      }
    });
    return Observable.from(result);
  }
}
