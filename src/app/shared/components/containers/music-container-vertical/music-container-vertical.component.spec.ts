import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MusicContainerVerticalComponent } from './music-container-vertical.component';

describe('MusicContainerVerticalComponent', () => {
  let component: MusicContainerVerticalComponent;
  let fixture: ComponentFixture<MusicContainerVerticalComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MusicContainerVerticalComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MusicContainerVerticalComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
