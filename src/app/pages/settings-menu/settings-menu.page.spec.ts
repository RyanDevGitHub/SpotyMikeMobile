import { ComponentFixture, TestBed } from '@angular/core/testing';

import { SettingsMenuPage } from './settings-menu.page';

describe('SettingsMenuPage', () => {
  let component: SettingsMenuPage;
  let fixture: ComponentFixture<SettingsMenuPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(SettingsMenuPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
