import { Component, Input, Output, EventEmitter, AfterViewInit, OnInit} from '@angular/core';
import { AppsyncService } from '../appsync.service';
import Message from '../types/message';
import readUserFragment from '../graphql/queries/readUserFragment';
import User from '../types/user';

const USER_ID_PREFIX = 'User:';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements AfterViewInit, OnInit {

  @Input() message: Message;
  @Input() fromMe: boolean;
  @Input() isLast = false;
  @Input() isFirst = false;
  @Output() added: EventEmitter<Message> = new EventEmitter();

  user: User;

  constructor(private appsync: AppsyncService) {}

  ngOnInit() {
    this.appsync.hc().then(client => {
      this.user = client.readFragment({
        id: USER_ID_PREFIX + this.message.sender,
        fragment: readUserFragment
      });
    });
  }

  ngAfterViewInit() {
    if (!this.isFirst && !this.isLast) { return; }
    console.log('message: ngAfterViewChecked: ', this.message.id, this.isFirst, this.isLast);
    this.added.emit(this.message);
  }
}
