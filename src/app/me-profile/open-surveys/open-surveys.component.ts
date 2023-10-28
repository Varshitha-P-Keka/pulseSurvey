import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { loggeduser } from 'src/app/modals/modal';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ServicesService } from 'src/app/services/services.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { FullModalTakeSurveyDetailsComponent } from 'src/app/modal-components/full-modal-take-survey-details/full-modal-take-survey-details.component';

@Component({
  selector: 'app-open-surveys',
  standalone: true,
  imports: [CommonModule,FullModalTakeSurveyDetailsComponent],
  templateUrl: './open-surveys.component.html',
  styleUrls: ['./open-surveys.component.scss']
})
export class OpenSurveysComponent {
  @Input() userDetails:loggeduser={name:'',emailaddress:'',employeeId:'',role:''};
  surveyDetails:any;
  currentDate:any;
  bsModalRef: BsModalRef | undefined;

  constructor(private service:ServicesService,private modalService: BsModalService,private udService:UserDataService){}

  ngOnInit(){
    // this.openFullModal(10);
    this.currentDate = new Date();
    // console.log(this.currentDate);
    this.userDetails=JSON.parse(<string>localStorage.getItem('currentUser'));
    this.service.getOpenSurveysData(this.userDetails.employeeId).subscribe({
      next: (data)=>{
        this.surveyDetails= data ;
      },
      error: (e)=>{console.log(e)}
    })
  }

  openFullModal(id:number){
    this.udService.setSurveyId(id);
    this.bsModalRef = this.modalService.show(FullModalTakeSurveyDetailsComponent,{ class: 'full-modal'});
  }
}
