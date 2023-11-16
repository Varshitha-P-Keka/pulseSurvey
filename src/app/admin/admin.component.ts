import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router, RouterOutlet,RouterLinkActive } from '@angular/router';

@Component ({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterLinkActive,RouterModule],
  templateUrl: './admin.component.html'
})

export class AdminComponent {
  
  constructor(public router:Router){}

  navigateTo() {
    this.router.navigate(['/pulseSurvey/home/Admin/surveys/active']);
  }
}