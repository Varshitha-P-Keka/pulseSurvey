import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component, Input } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService } from 'src/app/services/api.service';
import { UserDataService } from 'src/app/services/user-data.service';
import { FullModalTakeSurveyDetailsComponent } from 'src/app/modal-components/full-modal-take-survey-details/full-modal-take-survey-details.component';

@Component({
    selector: 'app-open-surveys',
    standalone: true,
    imports: [CommonModule, RouterOutlet, FullModalTakeSurveyDetailsComponent],
    templateUrl: './open-surveys.component.html',
})
export class OpenSurveysComponent {
    surveyDetails: any;
    currentDate: any;
    bsModalRef: BsModalRef | undefined;
    subscriptionId: any;

    constructor(private apiService: ApiService, private modalService: BsModalService, private behaviorSubjectService: UserDataService) {}

    ngOnInit() {
        this.currentDate = new Date();
        this.apiService.getOpenSurveysData().subscribe({
            next: (data) => {
                this.surveyDetails = data;
            },
            error: (e) => {
            },
        });
    }

    openFullModal(id: number) {
        this.behaviorSubjectService.setSurveyId(id);
        this.bsModalRef = this.modalService.show(FullModalTakeSurveyDetailsComponent, { class: 'full-modal' });
    }
}
