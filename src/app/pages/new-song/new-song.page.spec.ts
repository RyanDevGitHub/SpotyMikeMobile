import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NewSongPage } from './new-song.page';

describe('NewSongPage', () => {
  let component: NewSongPage;
  let fixture: ComponentFixture<NewSongPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(NewSongPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
