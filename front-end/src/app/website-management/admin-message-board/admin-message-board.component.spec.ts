import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AdminMessageBoardComponent } from './admin-message-board.component';

describe('AdminMessageBoardComponent', () => {
  let component: AdminMessageBoardComponent;
  let fixture: ComponentFixture<AdminMessageBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AdminMessageBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(AdminMessageBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
