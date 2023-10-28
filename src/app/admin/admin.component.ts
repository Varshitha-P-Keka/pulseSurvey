import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BsDropdownDirective } from 'ngx-bootstrap/dropdown';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss']
})
export class AdminComponent {
  constructor(private router:Router){}
  showSurveys: boolean = true;
  showSettings: boolean = false;
  showActiveTab: boolean = true;
  showClosedTab: boolean = false;

  surveys: any[] = [
    {
      column1: ["Survey Name", "Survey details"],
      column2: ["Completion percentage"],
      column3: ["Expiration date"],
      column4: ["launch date", "Person Launched"]

    }
  ];

  toSurveys() {
    this.showSurveys = true;
    this.showSettings = false;
    this.router.navigate(['/pulseSurvey/home/Admin/surveys']);
  }
  
  isSurveysActive() {
    return this.showSurveys ? 'active' : '';
  }

  isSettingsActive() {
    return this.showSettings ? 'active' : '';
  }

  isActive(){
    return this.showActiveTab? 'active': '';
  }

  isClosed(){
    return this.showClosedTab? 'active': '';
  }

  toActiveTab(){
    this.showActiveTab = true;
    this.showClosedTab = false;
    this.router.navigate(['/pulseSurvey/home/Admin/surveys/active']);

  }

  toClosedTab(){
    this.showActiveTab = false;
    this.showClosedTab = true;
    this.router.navigate(['/pulseSurvey/home/Admin/surveys/closed']);

  }

  toSettings() {
    this.showSurveys = false;
    this.showSettings = true;
    this.router.navigate(['/pulseSurvey/home/Admin/settings']);
  }
}
