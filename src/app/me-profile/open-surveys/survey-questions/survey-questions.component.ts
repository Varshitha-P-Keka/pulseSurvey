import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { loggeduser } from 'src/app/modals/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { UserDataService } from 'src/app/services/user-data.service';
import { ServicesService } from 'src/app/services/services.service';
import { surveyQuestionAddResponse } from 'src/app/modals/modal';

@Component({
    selector: 'app-survey-questions',
    standalone: true,
    imports: [CommonModule, NgSelectModule, FormsModule],
    templateUrl: './survey-questions.component.html',
    styleUrls: ['./survey-questions.component.scss'],
})
export class SurveyQuestionsComponent {
    @Input() surveyId: number = 0;
    userDetails:loggeduser={name:'',emailaddress:'',employeeId:'',role:''};
    surveyQuestionsArray: any;
    selectedRating: number = 0;
    selectedOption: number = 0;
    userResponse: string = '';
    surveyQuestionResponse: surveyQuestionAddResponse = { questionResponseId: 0, surveyQuestionId: 0, comment: '', selectedOption: 0 };
    surveyQuestionResponseArray: surveyQuestionAddResponse[] = [];
    responseArrayFlag: boolean = false;
    subscription:any;

    constructor(private httpService: ServicesService, private udService: UserDataService, private bsModelRef: BsModalRef) {}

    ngOnInit() {
      this.userDetails=JSON.parse(<string>localStorage.getItem('currentUser'));

        this.subscription=this.udService.getSurveyQuestionsConfirmation().subscribe({
          next:(data)=>{
            if(data){
              console.log("sabscribe",this.surveyQuestionResponseArray);
              this.httpService.postQuestionResponses({"surveyId":this.surveyId,"employeeId":<number>(<unknown>(this.userDetails.employeeId)),"responses":this.surveyQuestionResponseArray}).subscribe({
                next:(data)=>{console.log("Posted the data")},
                error:(e)=>{console.log(e)}
              })
              this.bsModelRef.hide();
            }
          }
        })
        

        this.httpService.getSurveyQuestionsById(this.surveyId).subscribe({
            next: (data) => {
                this.surveyQuestionsArray = data;
                console.log("Hii",data);
                this.assignSurveyQuestionResponseArray(this.surveyQuestionsArray.length);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    ngOnDestroy(){
      this.udService.setSurveyQuestionsConfirmation(false);
      this.subscription.unsubscribe();
    }

    assignSurveyQuestionResponseArray(length: number) {
        for (let i = 0; i < length; ++i) {
            this.surveyQuestionResponseArray.push({ questionResponseId: 0, surveyQuestionId: this.surveyQuestionsArray[i].surveyQuestionId, comment: '', selectedOption: 0 });
        }
        this.responseArrayFlag = this.surveyQuestionResponseArray.length == length;
    }

    updateComment(event: any) {
        let userResponseObject = this.surveyQuestionResponseArray.find((obj) => obj.surveyQuestionId == event.target.id);
        if (userResponseObject?.surveyQuestionId == event.target.id) {
            userResponseObject!.comment = event.target.value;
        }
    }

    updateRating(id: number, rating: number) {
        let ratingObject = this.surveyQuestionResponseArray.find((obj) => obj.surveyQuestionId === id);
        if (ratingObject?.surveyQuestionId == id) {
            ratingObject.selectedOption = rating;
        }
    }

    optionSelected(id: number, value: number) {
        let optionObject = this.surveyQuestionResponseArray.find((obj) => obj.surveyQuestionId === id);
        if (optionObject?.surveyQuestionId == id) {
            optionObject.selectedOption = value;
        }
    }
}
