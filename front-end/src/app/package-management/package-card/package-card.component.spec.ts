import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PackageCardComponent } from './package-card.component';

describe('PackageCardComponent', () => {
  let component: PackageCardComponent;
  let fixture: ComponentFixture<PackageCardComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PackageCardComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PackageCardComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
