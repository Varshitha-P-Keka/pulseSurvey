import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FormsModule } from '@angular/forms';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectModule } from '@ng-select/ng-select';
import { switchMap, EMPTY, take } from 'rxjs';
import { ServicesService } from 'src/app/services/services.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { BsModalRef } from 'ngx-bootstrap/modal';

@Component({
    selector: 'app-right-modal-question-details',
    standalone: true,
    imports: [CommonModule, FormsModule, NgSelectModule, BsDatepickerModule],
    templateUrl: './right-modal-question-details.component.html'
})

export class RightModalQuestionDetailsComponent {
    currentSurvey: any;
    toggleTab: string = 'analytical';
    detailedCurrentSurveyArray: any;
    detailedSurvey:any
    currentQuestionId: number = 0;
    currentQuestionIndex: number = 0;
    totalQuestions: number = 0;
    questionOptions: number[] = [];
    selectedQuestion: any = 'Question';

    constructor(private modalRef: BsModalRef, private behaviorSubjectService: UserDataService, private httpService: ServicesService) {}

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
                        return this.httpService.getAnalyticalQuestionSummaryById(this.currentQuestionId);
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
                error: (e) => {
                    console.log(e);
                },
            });
    }

    onQuestionChange(id: number) {
        this.currentQuestionId = id;
        this.currentQuestionIndex = <number>this.questionOptions.findIndex((questionId) => id == questionId);
        this.selectedQuestion = `Question ${this.currentQuestionIndex + 1}`;
        if (this.toggleTab == 'analytical') {
            this.httpService.getAnalyticalQuestionSummaryById(id).subscribe({
                next: (data) => {
                    this.currentSurvey = data;
                },
                error: (e) => {},
            });
        }
        if (this.toggleTab == 'detailed') {
            this.httpService.getDetailedQuestionSummaryById(id).subscribe({
                next: (data) => {
                    this.detailedSurvey = data;
                    this.currentSurvey = data;
                    switch(this.detailedSurvey.questionType){
                      case 'Text' : this.detailedCurrentSurveyArray = this.detailedSurvey.employees[0]; break;
                      case 'Rating': this.detailedCurrentSurveyArray = this.detailedSurvey.employees;break;
                      case 'Select one from list': this.detailedCurrentSurveyArray = this.detailedSurvey;break;
                    }
                    console.log('Detailed', data);
                },
                error: (e) => {
                    console.log(e);
                },
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
