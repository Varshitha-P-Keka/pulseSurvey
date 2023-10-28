import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalRef} from 'ngx-bootstrap/modal';
import { ServicesService } from 'src/app/services/services.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-full-modal-take-survey-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './full-modal-take-survey-details.component.html',
  styleUrls: ['./full-modal-take-survey-details.component.scss']
})
export class FullModalTakeSurveyDetailsComponent {
  surveyId:any=0;
  surveyDetails:any;

  constructor( public bsModalRef: BsModalRef, private udService:UserDataService, private service:ServicesService){}

  ngOnInit(){
    this.udService.getSurveyId().subscribe({
      next: (data)=>{
        this.surveyId=data;
      },
      error: (e)=>{console.log(e)}
    })
    if(this.surveyId){
      this.service.getSurveyDetailsById(this.surveyId).subscribe({
        next: (data)=>{
          this.surveyDetails=data;
          console.log(data);
        },
        error: (e)=>{console.log(e)}
      })
    }
  }

  modalHide(){
    this.bsModalRef.hide();
  }

}
