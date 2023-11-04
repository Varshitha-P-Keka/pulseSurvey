import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-surveys',
  standalone: true,
  imports: [CommonModule,RouterOutlet],
  templateUrl: './surveys.component.html',
  styleUrls: ['./surveys.component.scss']
})
export class SurveysComponent {
  showSurveys: boolean = true;
  showSettings: boolean = false;
  showActiveTab: boolean = true;
  showClosedTab: boolean = false;
  constructor(private router:Router,private service:ServicesService){}
  toSurveys() {
    this.showSurveys = true;
    this.showSettings = false;
    this.router.navigate(['/pulseSurvey/home/Admin/surveys']);    
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

}
