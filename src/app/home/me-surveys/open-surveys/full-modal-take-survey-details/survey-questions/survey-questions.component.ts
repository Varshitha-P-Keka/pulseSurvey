import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

import { Guid } from 'guid-typescript';
import { switchMap, EMPTY } from 'rxjs';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsModalRef } from 'ngx-bootstrap/modal';

import { IsRequired, ApiService, UserDataService, surveyQuestionResponse, SurveyQuestionAddResponse, SurveyQuestionResponseArray, QuestionType } from '../../../../../shared';

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
  questionType: QuestionType = QuestionType.Rating;
  QuestionType = QuestionType;
  surveyQuestionResponse: SurveyQuestionAddResponse = {
    questionResponseId: '',
    surveyQuestionId: 0,
    response: '',
  };
  surveyQuestionResponseArray: SurveyQuestionAddResponse[] = [];
  responseArrayFlag: boolean = false;
  subscription: any;
  updateSelectAndRatingArray: any = [];
  isRequiredArray: {}[] = [];

  constructor(private apiService: ApiService, private behaviorSubjectService: UserDataService, private bsModelRef: BsModalRef, private router: Router, private spinner: SpinnerVisibilityService) {}

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
    return new surveyQuestionResponse(
      this.surveyId,
      this.surveyQuestionResponseArray
    );
  }

  private getSurveyQuestions(): void {
    this.apiService.getSurveyQuestionsById(this.surveyId).subscribe({
      next: (data) => {
        this.spinner.hide();
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

  private assignSurveyQuestionResponseArray(surveyQuestionsArray: any): void {
    this.updateSelectAndRatingArray = [];
    for (let i = 0; i < surveyQuestionsArray.length; ++i) {
      this.isRequiredArray.push( new IsRequired( surveyQuestionsArray[i].surveyQuestionId, surveyQuestionsArray[i].isRequired,surveyQuestionsArray[i].isRequired));
      let createSurveyQuestionResponseId = Guid.create();
      let surveyQuestionResponseId: string = Reflect.get(createSurveyQuestionResponseId,'value');
      this.surveyQuestionResponseArray.push(new SurveyQuestionResponseArray(surveyQuestionResponseId,this.surveyQuestionsArray[i].surveyQuestionId,''));
      this.createSurveyQuestionResponseArray(surveyQuestionsArray[i].questionType);
    }
    this.responseArrayFlag = this.surveyQuestionResponseArray.length == surveyQuestionsArray.length;
  }

  private createSurveyQuestionResponseArray(question: any): void {
    switch (question) {
      case QuestionType.Rating: this.updateSelectAndRatingArray.push({ selectedRating: 0 }); break;
      case QuestionType.Dropdown: this.updateSelectAndRatingArray.push({ selectedOption: 'Select' }); break;
      case QuestionType.Comment: this.updateSelectAndRatingArray.push({ type: '' });
    }
  }

  updateComment(event: any): void {
    this.updateSelectedOption(event.target.id, event.target.value.trim());
    this.isRequiredUpdate(event.target.id, event.target.value.trim());
    this.behaviorSubjectService.setRequiredArray(this.isRequiredArray);
  }

  updateRating(id: number, rating: number, ratingArrayIndex: number): void {
    this.updateSelectedOption(id, rating);
    this.isRequiredUpdate(id, rating);
    this.behaviorSubjectService.setRequiredArray(this.isRequiredArray);
    this.updateSelectAndRatingArray[ratingArrayIndex].selectedRating = rating;
  }

  optionSelected(id: number, event: any): void {
    this.updateSelectedOption(id, event);
    this.isRequiredUpdate(id, event);
    this.behaviorSubjectService.setRequiredArray(this.isRequiredArray);
  }

  private updateSelectedOption(id: number, rating: any): void {
    let selectedObject = this.surveyQuestionResponseArray.find(
      (obj) => obj.surveyQuestionId == id
    );
    if (selectedObject?.surveyQuestionId == id) selectedObject.response = rating.toString();    
  }

  private isRequiredUpdate(id: any, value: any): void {
    let required: any = this.isRequiredArray.find((obj: any) => {
      return obj.id == id;
    });
    if (!required.requiredCondition) {
      required.isRequired = false;
    }
    if (required.requiredCondition) {
      if (value.length || value.length == undefined) {
        required.isRequired = false;
      } else {
        required.isRequired = true;
      }
    }
  }
}