import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet, Router, RouterLink } from '@angular/router';

@Component({
  selector: 'app-me-surveys',
  standalone: true,
  imports: [CommonModule, RouterOutlet, RouterLink],
  templateUrl: './me-surveys.component.html'
})
export class MeSurveysComponent {

  constructor(public router: Router){}

}
