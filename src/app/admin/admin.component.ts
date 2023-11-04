import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ServicesService } from '../services/services.service';
import { DatePipe } from '@angular/common';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { RouterOutlet } from '@angular/router';
import { SurveysComponent } from './surveys/surveys.component';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule,BsDropdownModule,SurveysComponent,RouterOutlet],
  templateUrl: './admin.component.html',
  styleUrls: ['./admin.component.scss'],
  providers:[]
})
export class AdminComponent implements OnInit {
  activeSurveys:any = null;
  formattedDate:any;
  formattedLaunchedOn:any;
  expiresOn:any;
  launchedOn:any;
  surveys:any;
  
  ngOnInit(): void {
    this.service.getactiveSurveys().subscribe((data) => {
      this.activeSurveys = data;
      this.surveys = this.activeSurveys;
      this.surveys.reverse();
      for (const survey of this.surveys) {
        this.launchedOn = this.formattedLaunchedOn = new DatePipe('en-US').transform(survey.expiresOn, 'MMM dd, yyyy');        
        this.expiresOn = this.formattedDate = new DatePipe('en-US').transform(survey.expiresOn, 'MMM dd, yyyy');        
      }
    });
  }
  constructor(private router:Router,private service:ServicesService){
    const date = this.expiresOn;
    this.formattedDate = new DatePipe('en-US').transform(date, 'MMM dd, yyyy');
    
  }
  showSurveys: boolean = true;
  showSettings: boolean = false;
  showActiveTab: boolean = true;
  showClosedTab: boolean = false;

  toSurveys() {
    this.showSurveys = true;
    this.showSettings = false;
    this.router.navigate(['/pulseSurvey/home/Admin/surveys/active']);    
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