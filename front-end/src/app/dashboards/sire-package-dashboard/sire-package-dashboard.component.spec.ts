import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SirePackageDashboardComponent } from './sire-package-dashboard.component';

describe('SirePackageDashboardComponent', () => {
  let component: SirePackageDashboardComponent;
  let fixture: ComponentFixture<SirePackageDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ SirePackageDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(SirePackageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
