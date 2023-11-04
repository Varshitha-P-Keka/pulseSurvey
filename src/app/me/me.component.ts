import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

@Component({
  selector: 'app-me',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent {
  
  constructor(private router:Router){}
  showOpenSurveys: boolean = true;
    showCompletedSurveys: boolean = false;
    surveys: any[] = [
      {
        column1: ["Survey Name", "Survey details"],
        column2: ["Survey date", "Expiration"],
        column3: ["launch date", "Person Launched"]
      }
    ];
    
    toOpenSurveys() {
      // this.router.navigate(['/pulseSurvey/home/Me/openSurveys']);
      this.showOpenSurveys = true;
      this.showCompletedSurveys = false;
    }

    toCompletedSurveys() {
      this.showOpenSurveys = false;
      this.showCompletedSurveys = true;
      // this.router.navigate(['/pulseSurvey/home/Me/completedSurveys']);
    }
}