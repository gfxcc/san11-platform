import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ThreadCardComponent } from './thread-card.component';

describe('ThreadCardComponent', () => {
  let component: ThreadCardComponent;
  let fixture: ComponentFixture<ThreadCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ThreadCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ThreadCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
