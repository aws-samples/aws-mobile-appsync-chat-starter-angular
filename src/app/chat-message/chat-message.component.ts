import { Component, Input, Output, EventEmitter, AfterViewInit} from '@angular/core';
import Message from '../types/message';

@Component({
  selector: 'app-chat-message',
  templateUrl: './chat-message.component.html',
  styleUrls: ['./chat-message.component.css']
})
export class ChatMessageComponent implements AfterViewInit {

  @Input() message: Message;
  @Input() fromMe: boolean;
  @Input() username: string;
  @Input() isLast = false;
  @Input() isFirst = false;

  @Output() added: EventEmitter<Message> = new EventEmitter();

  constructor() {}

  ngAfterViewInit() {
    if (!this.isFirst && !this.isLast) { return; }
    console.log('message: ngAfterViewChecked: ', this.message.id, this.isFirst, this.isLast);
    this.added.emit(this.message);
  }
}
