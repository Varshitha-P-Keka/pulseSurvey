import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { switchMap, EMPTY, take } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService, UserDataService, QuestionType} from '../../../../../shared';
import { RightModalQuestionDetailsComponent } from './right-modal-question-details/right-modal-question-details.component';

@Component({
    selector: 'app-view-survey',
    standalone: true,
    imports: [CommonModule, RightModalQuestionDetailsComponent],
    templateUrl: './view-survey.component.html',
})

export class ViewSurveyComponent {
    modalRef: BsModalRef | undefined;
    currentSurvey: any;
    questionType:QuestionType = QuestionType.Comment;
    QuestionType = QuestionType
    currentSurveyId: number = 0;
    surveyQuestionsId: number[] = [];
    question: any;


    constructor(private behaviorSubjectService: UserDataService, private apiService: ApiService, private bsModalService: BsModalService) {}

    ngOnInit() {
        this.behaviorSubjectService
            .getViewSurveyId()
            .pipe(
                take(1),
                switchMap((data) => {
                    if (data) {
                        return this.apiService.getViewSurveyById(data);
                    } else {
                        return EMPTY;
                    }
                })
            )
            .subscribe({
                next: (data) => {
                    this.currentSurvey = data;
                    for (this.question of this.currentSurvey.surveyQuestionsSummary) {
                        this.surveyQuestionsId.push(this.question.surveyQuestionId);
                    }
                },
                error: (e) => {
                },
            });
    }

    openQuestionDetails(id: number):void {
        this.behaviorSubjectService.setViewClosedSurveyId({ id: id, surveyQuestionsId: this.surveyQuestionsId });
        this.modalRef = this.bsModalService.show(RightModalQuestionDetailsComponent, { class: 'right-modal right-modal-900' });
    }
}