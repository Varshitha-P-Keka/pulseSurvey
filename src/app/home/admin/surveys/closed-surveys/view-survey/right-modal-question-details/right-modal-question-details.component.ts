import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

import { switchMap, EMPTY, take } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap/modal';
import { NgSelectModule } from '@ng-select/ng-select';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ApiService, UserDataService, QuestionType, Tabs } from '../../../../../../shared';

@Component({
    selector: 'app-right-modal-question-details',
    standalone: true,
    imports: [CommonModule, FormsModule, NgSelectModule, BsDatepickerModule],
    templateUrl: './right-modal-question-details.component.html',
})

export class RightModalQuestionDetailsComponent {
    currentSurvey: any;
    toggleTab: string = 'analytical';
    detailedCurrentSurveyArray: any;
    detailedSurvey: any;
    questionType:QuestionType = QuestionType.Rating;
    QuestionType = QuestionType;
    toggleTabs:Tabs = Tabs.Analytical;
    Tabs = Tabs;
    currentQuestionId: number = 0;
    currentQuestionIndex: number = 0;
    totalQuestions: number = 0;
    questionOptions: number[] = [];
    selectedQuestion: any = 'Question';

    constructor(private modalRef: BsModalRef, private behaviorSubjectService: UserDataService, private apiService: ApiService, private spinner: SpinnerVisibilityService) {}

    ngOnInit() {
        this.behaviorSubjectService
            .getViewClosedSurveyId()
            .pipe(
                take(1),
                switchMap((data) => {
                    if (data) {
                        let dataArray = data as any;
                        this.currentQuestionId = dataArray.id;
                        this.questionOptions = dataArray.surveyQuestionsId;
                        this.currentQuestionIndex = this.questionOptions.findIndex((id) => id == this.currentQuestionId);
                        this.totalQuestions = this.questionOptions.length;
                        this.selectedQuestion = `Question ${this.currentQuestionIndex + 1}`;
                        return this.apiService.getAnalyticalQuestionSummaryById(this.currentQuestionId);
                    }
                    return EMPTY;
                })
            )
            .subscribe({
                next: (data) => {
                    if (data) {
                        this.currentSurvey = data;
                    }
                },
                error: (e) => {},
            });
    }

    onQuestionChange(id: number) {
        this.currentQuestionId = id;
        this.currentQuestionIndex = <number>this.questionOptions.findIndex((questionId) => id == questionId);
        this.selectedQuestion = `Question ${this.currentQuestionIndex + 1}`;

        if (this.toggleTab == Tabs.Analytical) {
            this.apiService.getAnalyticalQuestionSummaryById(id).subscribe({
                next: (data) => {
                    this.currentSurvey = data;
                },
                error: (e) => {},
            });
        }

        if (this.toggleTab == Tabs.Detailed) {
            this.apiService.getDetailedQuestionSummaryById(id).subscribe({
                next: (data) => {
                    this.spinner.hide();
                    this.detailedSurvey = data;
                    this.currentSurvey = data;
                    switch (this.detailedSurvey.questionType) {
                        case QuestionType.Comment:
                            this.detailedCurrentSurveyArray = this.detailedSurvey.employees[0];
                            break;
                        case QuestionType.Rating:
                            this.detailedCurrentSurveyArray = this.detailedSurvey.employees;
                            break;
                        case QuestionType.Dropdown:
                            this.detailedCurrentSurveyArray = this.detailedSurvey;
                            break;
                    }
                },
                error: (e) => {},
            });
        }
    }

    previousQuestion() {
        if (this.currentQuestionIndex > 0) {
            this.onQuestionChange(this.questionOptions[this.currentQuestionIndex - 1]);
        }
    }

    nextQuestion() {
        if (this.currentQuestionIndex < this.totalQuestions - 1) {
            this.onQuestionChange(this.questionOptions[this.currentQuestionIndex + 1]);
        }
    }

    modalHide() {
        this.modalRef.hide();
    }

    toggle(switchTab: string) {
        if (this.toggleTab != switchTab) {
            this.toggleTab = switchTab;
            this.onQuestionChange(this.currentQuestionId);
        }
    }
}