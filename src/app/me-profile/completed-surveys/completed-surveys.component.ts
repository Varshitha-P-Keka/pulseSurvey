import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { loggeduser } from 'src/app/modals/modal';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-completed-surveys',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './completed-surveys.component.html',
  styleUrls: ['./completed-surveys.component.scss']
})
export class CompletedSurveysComponent {
  userDetails:loggeduser={name:'',emailaddress:'',employeeId:'',role:''};
  completedSurveys:any;
  constructor(private httpService:ServicesService){}

  ngOnInit(){
    this.userDetails=JSON.parse(<string>localStorage.getItem('currentUser'));
    this.httpService.getCompletdSurveys(<number>(<unknown>(this.userDetails.employeeId))).subscribe({
      next:(data)=>{
        this.completedSurveys = data;
        console.log("CompletedSurveys data",data);
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }
}
