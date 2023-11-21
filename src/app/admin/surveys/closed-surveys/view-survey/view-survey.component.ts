import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { switchMap, EMPTY, take } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService } from 'src/app/services/api.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { RightModalQuestionDetailsComponent } from 'src/app/modal-components/right-modal-question-details/right-modal-question-details.component';

@Component({
    selector: 'app-view-survey',
    standalone: true,
    imports: [CommonModule, RightModalQuestionDetailsComponent],
    templateUrl: './view-survey.component.html',
})
export class ViewSurveyComponent {
    modalRef: BsModalRef | undefined;
    currentSurvey: any;
    currentSurveyId: number = 0;
    surveyQuestionsId: number[] = [];
    question: any;

    constructor(private behaviorSubjectService: UserDataService, private apiService: ApiService, private modalService: BsModalService) {}

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
                    console.log(data);
                },
                error: (e) => {
                    console.log(e);
                },
            });
    }

    openQuestionDetails(id: number) {
        this.behaviorSubjectService.setViewClosedSurveyId({ id: id, surveyQuestionsId: this.surveyQuestionsId });
        this.modalRef = this.modalService.show(RightModalQuestionDetailsComponent, { class: 'right-modal right-modal-900' });
    }
}
