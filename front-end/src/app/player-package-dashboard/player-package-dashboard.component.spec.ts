import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlayerPackageDashboardComponent } from './player-package-dashboard.component';

describe('PlayerPackageDashboardComponent', () => {
  let component: PlayerPackageDashboardComponent;
  let fixture: ComponentFixture<PlayerPackageDashboardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PlayerPackageDashboardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PlayerPackageDashboardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
