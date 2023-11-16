import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './surveys.component.html'
})
export class SurveysComponent {
  showActiveTab: boolean = true;

  constructor(private router:Router){}
  
  setTab (active: boolean) {
    this.showActiveTab = active;
    const path = active ? 'active' : 'closed';
    this.router.navigate(['/pulseSurvey/home/Admin/surveys/', path]);
  }
}