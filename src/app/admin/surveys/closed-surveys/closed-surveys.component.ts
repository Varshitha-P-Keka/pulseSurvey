import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import { UserDataService } from 'src/app/services/user-data.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-closed-surveys',
  standalone: true,
  imports: [CommonModule,NgSelectModule],
  templateUrl: './closed-surveys.component.html',
  styleUrls: ['./closed-surveys.component.scss']
})

export class ClosedSurveysComponent {

  closedSurveys:any;

  filterOptions=[
    {id:1,name:"past 7 days"},
    {id:1,name:"past 14 days"},
    {id:1,name:"past 21 days"},
    {id:1,name:"custom range"}
]

  constructor(private httpService:ServicesService, private router: Router,private behaviorSubjectService:UserDataService){}

  ngOnInit(){
    this.httpService.getClosedSurveys().subscribe({
      next:(data)=>{
        this.closedSurveys = data;
        console.log(data);
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }

  filterPicked(val:string){
    console.log("Option changed",val);
  }

  toggleDropdown(survey: any) {
    survey.dropdownOpen = !survey.dropdownOpen;
  }

  reLaunchSurvey(survey:any){
    console.log("Re launch survey",survey);
  }

  viewSurvey(survey:any){
    this.behaviorSubjectService.setViewSurveyId(survey.surveyId);
    this.router.navigate(['pulseSurvey/home/Admin/surveys/closed/view']);
    console.log("View Survey",survey);
  }

}
