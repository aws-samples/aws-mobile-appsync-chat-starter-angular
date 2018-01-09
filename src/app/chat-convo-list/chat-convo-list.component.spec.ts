import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatConvoListComponent } from './chat-convo-list.component';

describe('ChatConvoListComponent', () => {
  let component: ChatConvoListComponent;
  let fixture: ComponentFixture<ChatConvoListComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChatConvoListComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChatConvoListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
