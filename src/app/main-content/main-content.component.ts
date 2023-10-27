import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule,RouterModule, RouterOutlet],
  templateUrl: './main-content.component.html',
  styleUrls: ['./main-content.component.scss'],
})
export class MainContentComponent {
  constructor(private router:Router){}

  toOpenSurveys() {
    this.router.navigate(['/pulseSurvey/home/Me/openSurveys']);
  }
  toCompletedSurveys() {
    this.router.navigate(['/pulseSurvey/home/Me/completedSurveys'])
  }


}
