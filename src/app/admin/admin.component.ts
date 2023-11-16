import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './admin.component.html'
})

export class AdminComponent {

  constructor(public router:Router){}

  navigateTo(route: string) {
    this.router.navigate([`/pulseSurvey/home/Admin/${route}`]);
  }

  isActive(route: string) {
    return this.router.url.endsWith(route);
  }
}