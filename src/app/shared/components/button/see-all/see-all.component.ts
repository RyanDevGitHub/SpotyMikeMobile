import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { IonText } from '@ionic/angular/standalone';

@Component({
  selector: 'app-see-all',
  templateUrl: './see-all.component.html',
  standalone: true,
  styleUrls: ['./see-all.component.scss'],
  imports: [IonText],
})
export class SeeAllComponent {
  constructor(private router: Router) {}
  @Input() redirectTo: string;
  @Input() param: string;

  redirectToPage() {
    this.router.navigate([this.redirectTo], {
      queryParams: { genre: this.param },
    });
  }
}
