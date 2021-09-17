import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GeneralDiscussionComponent } from './general-discussion.component';

describe('GeneralDiscussionComponent', () => {
  let component: GeneralDiscussionComponent;
  let fixture: ComponentFixture<GeneralDiscussionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ GeneralDiscussionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GeneralDiscussionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
