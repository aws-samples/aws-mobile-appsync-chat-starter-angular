import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AppsyncService } from '../appsync.service';
import getUserConversationsConnection from '../graphql/queries/getUserConversationsConnection';
import { constants } from '../chat-helper';
import Conversation from '../types/conversation';
import * as _ from 'lodash';

@Component({
  selector: 'app-chat-convo-list',
  templateUrl: './chat-convo-list.component.html',
  styleUrls: ['./chat-convo-list.component.css']
})
export class ChatConvoListComponent implements OnInit {

  nextToken: string;
  conversations: Conversation[] = [];
  _user: any;

  @Input()
  set user(user: any) {
    this._user = user;
    this.getAllConvos();
  }
  @Input() current: Conversation;
  @Output() onConvoClick = new EventEmitter<any>();

  constructor(private appsync: AppsyncService) { }

  ngOnInit() {}

  click(convo) { this.onConvoClick.emit(convo); }

  getAllConvos() {
    this.appsync.hc().then(client => {
      client.watchQuery({
        query: getUserConversationsConnection,
        variables: { first: constants.conversationFirst},
        fetchPolicy: 'cache-and-network',
        ssr: false
      }).subscribe(({data}) => {
        if (!data || !data.me) { return console.log('getUserConversationsConnection: no data'); }
        this.conversations = data.me.conversations.userConversations.map(u => u.conversation);
        this.conversations = _.sortBy(this.conversations, 'name');
        this.nextToken = data.me.conversations.nextToken;
        console.log('Fetched convos', this.conversations);
      });

    });
  }

}
