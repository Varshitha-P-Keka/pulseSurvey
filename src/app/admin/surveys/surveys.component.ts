import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet,RouterModule,RouterLinkActive } from '@angular/router';

@Component ({
  selector: 'app-surveys',
  standalone: true,
  imports: [CommonModule,RouterOutlet,RouterModule,RouterLinkActive],
  templateUrl: './surveys.component.html',
})
export class SurveysComponent {
  showActiveTab: boolean = true;

  constructor(){}
}