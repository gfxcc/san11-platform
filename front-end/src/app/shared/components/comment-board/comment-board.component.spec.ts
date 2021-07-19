import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CommentBoardComponent } from './comment-board.component';

describe('CommentBoardComponent', () => {
  let component: CommentBoardComponent;
  let fixture: ComponentFixture<CommentBoardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CommentBoardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CommentBoardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
