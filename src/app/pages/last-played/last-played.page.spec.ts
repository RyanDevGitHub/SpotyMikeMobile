import { ComponentFixture, TestBed } from '@angular/core/testing';

import { LastPlayedPage } from './last-played.page';

describe('LastPlayedPage', () => {
  let component: LastPlayedPage;
  let fixture: ComponentFixture<LastPlayedPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(LastPlayedPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
