import { ComponentFixture, TestBed } from '@angular/core/testing';

import { PlaySongPage } from './play-song.page';

describe('PlaySongPage', () => {
  let component: PlaySongPage;
  let fixture: ComponentFixture<PlaySongPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(PlaySongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
