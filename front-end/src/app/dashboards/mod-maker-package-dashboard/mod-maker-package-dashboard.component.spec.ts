import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ModMakerPackageDashboardComponent } from './mod-maker-package-dashboard.component';

describe('ModMakerPackageDashboardComponent', () => {
  let component: ModMakerPackageDashboardComponent;
  let fixture: ComponentFixture<ModMakerPackageDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ModMakerPackageDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ModMakerPackageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
