import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaylistesPage } from './playlistes.page';

describe('PlaylistesPage', () => {
  let component: PlaylistesPage;
  let fixture: ComponentFixture<PlaylistesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaylistesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
