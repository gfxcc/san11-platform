import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CreateNewVersionComponent } from './create-new-version.component';

describe('CreateNewVersionComponent', () => {
  let component: CreateNewVersionComponent;
  let fixture: ComponentFixture<CreateNewVersionComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ CreateNewVersionComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CreateNewVersionComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
