import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { ModalServiceService } from 'src/app/services/modal-service.service';

import { UserDataService } from 'src/app/services/user-data.service';
import { RelaunchSurveyComponent } from './relaunch-survey/relaunch-survey.component';
import { NgSelectModule } from '@ng-select/ng-select';
import { ServicesService } from 'src/app/services/services.service';

import { BsModalRef,BsModalService } from 'ngx-bootstrap/modal';

@Component({
  selector: 'app-closed-surveys',
  standalone: true,
  imports: [CommonModule,NgSelectModule,RelaunchSurveyComponent],
  providers: [BsModalService],
  templateUrl: './closed-surveys.component.html',
})

export class ClosedSurveysComponent {

  closedSurveys:any;
  bsModalRef!: BsModalRef;

  filterOptions=[
    {id:1,name:"past 7 days"},
    {id:1,name:"past 14 days"},
    {id:1,name:"past 21 days"},
    {id:1,name:"custom range"}
]

  constructor(private httpService:ServicesService,public modalService: BsModalService, private router: Router,private behaviorSubjectService:UserDataService,private ModalService:ModalServiceService){}

  ngOnInit() {
    this.httpService.surveyEdited$.subscribe((updated) => {
      if (updated) {
       this.showClosedSurveys();
      }
    });

    this.showClosedSurveys();
  }

  filterPicked(val:string){
    console.log("Option changed",val);
  }

  toggleDropdown(survey: any) {
    survey.dropdownOpen = !survey.dropdownOpen;
  }

  reLaunchSurvey(survey:any){
    this.bsModalRef = this.modalService.show(RelaunchSurveyComponent, { class: 'small-modal' });
    this.ModalService.setupdateSurvey(survey);
    survey.dropdownOpen = false; 
  }

  showClosedSurveys(){
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

  viewSurvey(survey:any){
    this.behaviorSubjectService.setViewSurveyId(survey.surveyId);
    this.router.navigate(['pulseSurvey/home/Admin/surveys/closed/view']);
    console.log("View Survey",survey);
  }

}
