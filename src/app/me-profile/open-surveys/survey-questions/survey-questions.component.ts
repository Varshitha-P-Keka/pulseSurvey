import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Guid } from 'guid-typescript';
import { switchMap, EMPTY } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';

import { BsModalRef } from 'ngx-bootstrap/modal';
import { ApiService } from 'src/app/services/api.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { SurveyQuestionAddResponse } from 'src/app/modals/surveyQuestionAddReponse';
import { Loggeduser } from 'src/app/modals/loggedUser';

@Component({
    selector: 'app-survey-questions',
    standalone: true,
    imports: [CommonModule, NgSelectModule, FormsModule],
    templateUrl: './survey-questions.component.html',
})
export class SurveyQuestionsComponent {
    @Input() surveyId: number = 0;
    userDetails: Loggeduser = { name: '', emailaddress: '', employeeId: '', role: '', profilePicture: '' };
    surveyQuestionsArray: any;
    selectedOption: number = 0;
    userResponse: string = '';
    surveyQuestionResponse: SurveyQuestionAddResponse = { questionResponseId: '', surveyQuestionId: 0, response: '' };
    surveyQuestionResponseArray: SurveyQuestionAddResponse[] = [];
    responseArrayFlag: boolean = false;
    subscription: any;
    updateSelectAndRatingArray: any = [];

    constructor(private apiService: ApiService, private behaviorubjectService: UserDataService, private bsModelRef: BsModalRef, private router: Router) {}

    ngOnInit() {
        this.userDetails = JSON.parse(<string>localStorage.getItem('currentUser'));
        this.subscription = this.behaviorubjectService
            .getSurveyQuestionsConfirmation()
            .pipe(
                switchMap((data) => {
                    if (data) {
                        return this.apiService.postQuestionResponses({ surveyId: this.surveyId, responses: this.surveyQuestionResponseArray });
                    } else {
                        return EMPTY;
                    }
                })
            )
            .subscribe({
                next: () => {
                    this.bsModelRef.hide();
                    this.router.navigate(['/pulseSurvey/home/completedSurveys']);
                },
                error: (e) => {
                    console.log(e);
                },
            });
        this.getSurveyQuestions();
    }

    getSurveyQuestions() {
        this.apiService.getSurveyQuestionsById(this.surveyId).subscribe({
            next: (data) => {
                this.surveyQuestionsArray = data;
                console.log('survey-questions-component', data);
                this.assignSurveyQuestionResponseArray(this.surveyQuestionsArray);
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    ngOnDestroy() {
        this.behaviorubjectService.setSurveyQuestionsConfirmation(false);
        this.subscription.unsubscribe();
    }

    assignSurveyQuestionResponseArray(surveyQuestionsArray: any) {
        this.updateSelectAndRatingArray = [];
        for (let i = 0; i < surveyQuestionsArray.length; ++i) {
            let qid = Guid.create();
            let guidValue: string = Reflect.get(qid, 'value');
            this.surveyQuestionResponseArray.push({ questionResponseId: guidValue, surveyQuestionId: this.surveyQuestionsArray[i].surveyQuestionId, response: '' });
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
            userResponseObject!.response = event.target.value;
        }
    }

    updateRating(id: number, rating: number, ratingArrayIndex: number) {
        let ratingObject = this.surveyQuestionResponseArray.find((obj) => obj.surveyQuestionId === id);
        if (ratingObject?.surveyQuestionId == id) {
            ratingObject.response = rating.toString();
        }
        this.updateSelectAndRatingArray[ratingArrayIndex].selectedRating = rating;
    }

    optionSelected(id: number, event: any) {
        let optionObject = this.surveyQuestionResponseArray.find((obj) => obj.surveyQuestionId === id);
        if (optionObject?.surveyQuestionId == id) {
            optionObject.response = event.toString();
        }
    }
}
