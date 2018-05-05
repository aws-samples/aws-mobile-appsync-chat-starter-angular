import { Component, Input } from '@angular/core';
import { AppsyncService } from '../appsync.service';
import { v4 as uuid } from 'uuid';
import createMessage from '../graphql/mutations/createMessage';
import getConversationMessages from '../graphql/queries/getConversationMessages';
import { unshiftMessage, constants } from '../chat-helper';
import Message from '../types/message';
import { Analytics } from 'aws-amplify';

@Component({
  selector: 'app-chat-input',
  templateUrl: './chat-input.component.html',
  styleUrls: ['./chat-input.component.css']
})
export class ChatInputComponent {

  message = '';

  @Input() conversation: any;
  @Input() senderId: string;
  constructor(private appsync: AppsyncService) {}

  createNewMessage() {
    if (!this.message || this.message.trim().length === 0) {
      this.message = '';
      return;
    }
    const id = `${new Date().toISOString()}_${uuid()}`
    const message: Message = {
      conversationId: this.conversation.id,
      content: this.message,
      createdAt: id,
      sender: this.senderId,
      isSent: false,
      id : id
    };
    console.log('new message', message);
    this.message = '';
    this.appsync.hc().then(client => {
      client.mutate({
        mutation: createMessage,
        variables: message,

        optimisticResponse: () => ({
          createMessage: {
            ...message,
            __typename: 'Message'
          }
        }),

        update: (proxy, {data: { createMessage: _message }}) => {

          const options = {
            query: getConversationMessages,
            variables: { conversationId: this.conversation.id, first: constants.messageFirst }
          };

          const data = proxy.readQuery(options);
          const _tmp = unshiftMessage(data, _message);
          proxy.writeQuery({...options, data: _tmp});
        }
      }).then(({data}) => {
        console.log('mutation complete', data);
      }).catch(err => console.log('Error creating message', err));
    });
    Analytics.record('Chat MSG Sent');
  }
}
