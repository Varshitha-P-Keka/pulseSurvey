import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService } from 'src/app/services/api.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { DetailsComponent } from 'src/app/me-profile/open-surveys/details/details.component';
import { SurveyQuestionsComponent } from 'src/app/me-profile/open-surveys/survey-questions/survey-questions.component';
import { SmallModalSurveyConfirmationComponent } from '../small-modal-survey-confirmation/small-modal-survey-confirmation.component';

@Component({
    selector: 'app-full-modal-take-survey-details',
    standalone: true,
    imports: [CommonModule, DetailsComponent, SurveyQuestionsComponent, SmallModalSurveyConfirmationComponent],
    templateUrl: './full-modal-take-survey-details.component.html',
})
export class FullModalTakeSurveyDetailsComponent {
    surveyId: any = 0;
    surveyDetails: any;
    tab: string = 'details';
    subheadNavActive: boolean = true;
    modalRef: BsModalRef | undefined;

    constructor(public bsModalRef: BsModalRef, private behaviorSubjectService: UserDataService, private apiService: ApiService, private modalService: BsModalService) {}

    ngOnInit() {
        this.behaviorSubjectService.getSurveyId().subscribe({
            next: (data) => {
                this.surveyId = data;
            },
            error: (e) => {},
        });

        if (this.surveyId) {
            this.apiService.getSurveyDetailsById(this.surveyId).subscribe({
                next: (data) => {
                    this.surveyDetails = data;
                },
                error: (e) => {},
            });
        }
    }

    openSurveyQuestions() {
        this.tab = 'surveyQuestions';
        this.subheadNavActive = false;
    }

    modalHide() {
        this.bsModalRef.hide();
    }

    navigateToDetails() {
        this.tab = 'details';
        this.subheadNavActive = true;
    }

    confirmationModal() {
        this.modalRef = this.modalService.show(SmallModalSurveyConfirmationComponent, { class: 'small-modal' });
    }
}
