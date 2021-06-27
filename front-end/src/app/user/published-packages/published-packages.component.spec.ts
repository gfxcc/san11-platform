import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PublishedPackagesComponent } from './published-packages.component';

describe('PublishedPackagesComponent', () => {
  let component: PublishedPackagesComponent;
  let fixture: ComponentFixture<PublishedPackagesComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ PublishedPackagesComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(PublishedPackagesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
