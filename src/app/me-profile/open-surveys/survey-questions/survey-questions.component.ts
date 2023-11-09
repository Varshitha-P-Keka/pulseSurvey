import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import { switchMap,EMPTY } from 'rxjs';
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
    userDetails: loggeduser = { name: '', emailaddress: '', employeeId: '', role: '' };
    surveyQuestionsArray: any;
    selectedOption: number = 0;
    userResponse: string = '';
    surveyQuestionResponse: surveyQuestionAddResponse = { questionResponseId: 0, surveyQuestionId: 0, comment: '', selectedOption: 0 };
    surveyQuestionResponseArray: surveyQuestionAddResponse[] = [];
    responseArrayFlag: boolean = false;
    subscription: any;
    updateSelectAndRatingArray: any = [];

    constructor(private httpService: ServicesService, private udService: UserDataService, private bsModelRef: BsModalRef, private router: Router) {}

    ngOnInit() {
        this.userDetails = JSON.parse(<string>localStorage.getItem('currentUser'));
        this.subscription=this.udService.getSurveyQuestionsConfirmation().pipe(
            switchMap((data) => {
              if (data) {
                return this.httpService.postQuestionResponses({ surveyId: this.surveyId, employeeId: <number>(<unknown>this.userDetails.employeeId), responses: this.surveyQuestionResponseArray });
              } else {
                return EMPTY;
              }
            })
          ).subscribe({
            next: () => {
              this.bsModelRef.hide();
              this.router.navigate(['/pulseSurvey/home/completedSurveys']);
            },
            error: (e) => {
              console.log(e);
            }
          });
        this.getSurveyQuestions();
    }

    getSurveyQuestions(){
        this.httpService.getSurveyQuestionsById(this.surveyId).subscribe({
            next: (data) => {
                this.surveyQuestionsArray = data;
                console.log("survey-questions-component",data);
                this.assignSurveyQuestionResponseArray(this.surveyQuestionsArray);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    ngOnDestroy() {
        this.udService.setSurveyQuestionsConfirmation(false);
        this.subscription.unsubscribe();
    }

    assignSurveyQuestionResponseArray(surveyQuestionsArray: any) {
        this.updateSelectAndRatingArray = [];
        for (let i = 0; i < surveyQuestionsArray.length; ++i) {
            this.surveyQuestionResponseArray.push({ questionResponseId: 0, surveyQuestionId: this.surveyQuestionsArray[i].surveyQuestionId, comment: '', selectedOption: 0 });
            switch (surveyQuestionsArray[i].questionType) {
                case 'Rating':
                    this.updateSelectAndRatingArray.push({ selectedRating: 0 });
                    break;
                case 'Select one from list':
                    this.updateSelectAndRatingArray.push({ selectedOption: 'Select' });
                    break;
                case 'Text':
                    this.updateSelectAndRatingArray.push({ type: '' });
            }
        }
        this.responseArrayFlag = this.surveyQuestionResponseArray.length == surveyQuestionsArray.length;
    }

    updateComment(event: any) {
        let userResponseObject = this.surveyQuestionResponseArray.find((obj) => obj.surveyQuestionId == event.target.id);
        if (userResponseObject?.surveyQuestionId == event.target.id) {
            userResponseObject!.comment = event.target.value;
        }
    }

    updateRating(id: number, rating: number, ratingArrayIndex: number) {
        let ratingObject = this.surveyQuestionResponseArray.find((obj) => obj.surveyQuestionId === id);
        if (ratingObject?.surveyQuestionId == id) {
            ratingObject.selectedOption = rating;
        }
        this.updateSelectAndRatingArray[ratingArrayIndex].selectedRating = rating;
    }

    optionSelected(id: number, value: number) {
        let optionObject = this.surveyQuestionResponseArray.find((obj) => obj.surveyQuestionId === id);
        if (optionObject?.surveyQuestionId == id) {
            optionObject.selectedOption = value;
        }
    }
}
