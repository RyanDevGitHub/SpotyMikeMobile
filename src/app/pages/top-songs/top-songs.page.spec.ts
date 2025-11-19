import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TopSongsPage } from './top-songs.page';

describe('TopSongsPage', () => {
  let component: TopSongsPage;
  let fixture: ComponentFixture<TopSongsPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(TopSongsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
