import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-closed-surveys-page',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './closed-surveys-page.component.html'
})
export class ClosedSurveysPageComponent {

}
