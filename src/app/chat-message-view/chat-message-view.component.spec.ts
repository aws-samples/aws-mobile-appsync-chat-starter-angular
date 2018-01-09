import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatMessageViewComponent } from './chat-message-view.component';

describe('ChatMessageViewComponent', () => {
  let component: ChatMessageViewComponent;
  let fixture: ComponentFixture<ChatMessageViewComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatMessageViewComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatMessageViewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
