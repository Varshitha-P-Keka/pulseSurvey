import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterModule } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { SurveysComponent } from '../admin/surveys/surveys.component';
import { SettingsComponent } from '../admin/settings/settings.component';
@Component({
  selector: 'app-main-content',
  standalone: true,
  imports: [CommonModule,RouterModule, RouterOutlet,SurveysComponent,SettingsComponent],
  templateUrl: './main-content.component.html'
})
export class MainContentComponent {
}