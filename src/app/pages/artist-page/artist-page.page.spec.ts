import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ArtistPagePage } from './artist-page.page';

describe('ArtistPagePage', () => {
  let component: ArtistPagePage;
  let fixture: ComponentFixture<ArtistPagePage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(ArtistPagePage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
