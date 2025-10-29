import { ComponentFixture, TestBed, waitForAsync } from '@angular/core/testing';
import { IonicModule } from '@ionic/angular';

import { MinimizePlayerAudioComponent } from './minimize-player-audio.component';

describe('MinimizePlayerAudioComponent', () => {
  let component: MinimizePlayerAudioComponent;
  let fixture: ComponentFixture<MinimizePlayerAudioComponent>;

  beforeEach(waitForAsync(() => {
    TestBed.configureTestingModule({
      declarations: [MinimizePlayerAudioComponent],
      imports: [IonicModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(MinimizePlayerAudioComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }));

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
