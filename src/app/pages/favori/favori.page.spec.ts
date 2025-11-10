import { ComponentFixture, TestBed } from '@angular/core/testing';

import { FavoriPage } from './favori.page';

describe('FavoriPage', () => {
  let component: FavoriPage;
  let fixture: ComponentFixture<FavoriPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(FavoriPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
