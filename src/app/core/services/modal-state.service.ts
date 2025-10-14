import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root', // ⚠️ important sinon undefined
})
export class ModalStateService {
  public modalOpen$ = new BehaviorSubject<boolean>(false);

  setModalOpen(isOpen: boolean) {
    this.modalOpen$.next(isOpen);
  }

  getModalOpen() {
    return this.modalOpen$.asObservable();
  }
}
