import { ComponentFixture, TestBed } from '@angular/core/testing';

import { UserInfoWithSubButtonComponent } from './user-info-with-sub-button.component';

describe('UserInfoWithSubButtonComponent', () => {
  let component: UserInfoWithSubButtonComponent;
  let fixture: ComponentFixture<UserInfoWithSubButtonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ UserInfoWithSubButtonComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(UserInfoWithSubButtonComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
