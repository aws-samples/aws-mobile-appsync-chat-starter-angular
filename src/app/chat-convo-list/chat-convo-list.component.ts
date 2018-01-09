import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppsyncService } from '../appsync.service';
import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';
import { constants } from '../chat-helper';
import Conversation from '../types/conversation';

@Component({
  selector: 'app-chat-convo-list',
  templateUrl: './chat-convo-list.component.html',
  styleUrls: ['./chat-convo-list.component.css']
})
export class ChatConvoListComponent implements OnInit {

  nextToken: string;
  conversations: Conversation[];
  order: string = 'name';

  @Input() current: Conversation;
  @Output() onConvoClick = new EventEmitter<any>();

  constructor(private appsync: AppsyncService) { }

  ngOnInit() { this.getAllConvos(); }

  click(convo) { this.onConvoClick.emit(convo); }

  getAllConvos() {
    this.appsync.client.hydrated().then(client => {
      client.watchQuery({
        query: getUserConversationsConnection,
        variables: { first: constants.conversationFirst},
        fetchPolicy: 'cache-and-network',
        ssr: false
      }).subscribe(({data}) => {
        if (!data) { return console.log('getUserConversationsConnection: no data'); }
        this.conversations = data.me.conversations.userConversations.map(u => u.conversation);
        this.nextToken = data.me.conversations.nextToken;
        console.log('Fetched convos', this.conversations);
      });

    });
  }

}
