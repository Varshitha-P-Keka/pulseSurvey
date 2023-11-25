import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router';
import { Component } from '@angular/core';

import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService, UserDataService } from '../../../shared';
import { FullModalTakeSurveyDetailsComponent } from '../../../home';

@Component({
    selector: 'app-open-surveys',
    standalone: true,
    imports: [CommonModule, RouterOutlet, FullModalTakeSurveyDetailsComponent],
    templateUrl: './open-surveys.component.html',
})

export class OpenSurveysComponent {
    surveyDetails: any;
    bsModalRef: BsModalRef | undefined;

    constructor(private apiService: ApiService, private modalService: BsModalService, private behaviorSubjectService: UserDataService, private spinner: SpinnerVisibilityService) {}

    ngOnInit():void {
        this.apiService.getOpenSurveysData().subscribe({
            next: (data) => {
                this.spinner.hide();
                this.surveyDetails = data;
            },
            error: (e) => {
            },
        });
    }

    openFullModal(id: number):void {
        this.behaviorSubjectService.setSurveyId(id);
        this.bsModalRef = this.modalService.show(FullModalTakeSurveyDetailsComponent, { class: 'full-modal' });
    }
}