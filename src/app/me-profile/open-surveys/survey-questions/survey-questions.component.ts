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
import { surveyQuestionResponse } from 'src/app/models/surveyQuestionResponse.model';
import { SurveyQuestionAddResponse } from 'src/app/models/surveyQuestionAddReponse.model';
import { SurveyQuestionResponseArray } from 'src/app/models/surveyQuestionResponseArray.model';

@Component({
    selector: 'app-survey-questions',
    standalone: true,
    imports: [CommonModule, NgSelectModule, FormsModule],
    templateUrl: './survey-questions.component.html',
})
export class SurveyQuestionsComponent {
    @Input() surveyId: number = 0;
    ratingBar = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10];
    surveyQuestionsArray: any;
    selectedOption: number = 0;
    userResponse: string = '';
    surveyQuestionResponse: SurveyQuestionAddResponse = { questionResponseId: '', surveyQuestionId: 0, response: '' };
    surveyQuestionResponseArray: SurveyQuestionAddResponse[] = [];
    responseArrayFlag: boolean = false;
    subscription: any;
    updateSelectAndRatingArray: any = [];

    constructor(private apiService: ApiService, private behaviorSubjectService: UserDataService, private bsModelRef: BsModalRef, private router: Router) {}

    ngOnInit() {
        this.subscription = this.behaviorSubjectService
            .getSurveyQuestionsConfirmation()
            .pipe(
                switchMap((data) => {
                    if (data) {
                        return this.apiService.postQuestionResponses(this.reponseObj());
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
                error: (e) => {},
            });
        this.getSurveyQuestions();
    }

    reponseObj() {
        return new surveyQuestionResponse(this.surveyId, this.surveyQuestionResponseArray);
    }

    getSurveyQuestions() {
        this.apiService.getSurveyQuestionsById(this.surveyId).subscribe({
            next: (data) => {
                this.surveyQuestionsArray = data;
                this.assignSurveyQuestionResponseArray(this.surveyQuestionsArray);
            },
            error: (e) => {},
        });
    }

    ngOnDestroy() {
        this.behaviorSubjectService.setSurveyQuestionsConfirmation(false);
        this.subscription.unsubscribe();
    }

    assignSurveyQuestionResponseArray(surveyQuestionsArray: any) {
        this.updateSelectAndRatingArray = [];
        for (let i = 0; i < surveyQuestionsArray.length; ++i) {
            let qid = Guid.create();
            let guidValue: string = Reflect.get(qid, 'value');
            this.surveyQuestionResponseArray.push(new SurveyQuestionResponseArray(guidValue, this.surveyQuestionsArray[i].surveyQuestionId, ''));
            this.createSurveyQuestionResponseArray(surveyQuestionsArray[i].questionType);
        }
        this.responseArrayFlag = this.surveyQuestionResponseArray.length == surveyQuestionsArray.length;
    }

    createSurveyQuestionResponseArray(question: any) {
        switch (question) {
            case 'Rating':
                this.updateSelectAndRatingArray.push({ selectedRating: 0 });
                break;
            case 'SelectOneFromList':
                this.updateSelectAndRatingArray.push({ selectedOption: 'Select' });
                break;
            case 'Text':
                this.updateSelectAndRatingArray.push({ type: '' });
        }
    }

    updateComment(event: any) {
        this.updateSelectedOption(event.target.id, event.target.value);
    }

    updateRating(id: number, rating: number, ratingArrayIndex: number) {
        this.updateSelectedOption(id, rating);
        this.updateSelectAndRatingArray[ratingArrayIndex].selectedRating = rating;
    }

    optionSelected(id: number, event: any) {
        this.updateSelectedOption(id, event);
    }

    updateSelectedOption(id: number, rating: any) {
        let selectedObject = this.surveyQuestionResponseArray.find((obj) => obj.surveyQuestionId == id);
        if (selectedObject?.surveyQuestionId == id) {
            selectedObject.response = rating.toString();
        }
    }
}
