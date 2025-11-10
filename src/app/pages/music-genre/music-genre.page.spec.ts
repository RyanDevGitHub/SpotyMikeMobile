import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MusicGenrePage } from './music-genre.page';

describe('MusicGenrePage', () => {
  let component: MusicGenrePage;
  let fixture: ComponentFixture<MusicGenrePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(MusicGenrePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
