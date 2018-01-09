import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatUserListComponent } from './chat-user-list.component';

describe('ChatUserListComponent', () => {
  let component: ChatUserListComponent;
  let fixture: ComponentFixture<ChatUserListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatUserListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatUserListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
