import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { Router, RouterOutlet, RouterModule } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService } from 'src/app/services/api.service';
import { ModalService } from 'src/app/services/modal-service.service';
import { CloseSurveyComponent } from 'src/app/admin-modals/close-survey/close-survey.component';
import { UpdateSurveyComponent } from 'src/app/admin-modals/update-survey/update-survey.component';

@Component({
    selector: 'app-active-surveys',
    standalone: true,
    imports: [CommonModule, RouterOutlet, UpdateSurveyComponent, CloseSurveyComponent, RouterModule],
    providers: [BsModalService],
    templateUrl: './active-surveys.component.html',
})
export class ActiveSurveysComponent {
    activeSurveys: any = null;
    bsModalRef!: BsModalRef;
    surveys: any;
    dropdownOpen: boolean = false;

    constructor(private apiService: ApiService, public bsModalService: BsModalService, private modalService: ModalService) {}

    onClick(event: Event) {
        if (!this.isClickedInside(event)) {
            this.surveys.forEach((survey: any) => (survey.dropdownOpen = false));
        }
    }

    isClickedInside(event: Event): boolean {
        return !!(event.target as HTMLElement).closest('.dropdown');
    }

    closeAllDropdowns() {
        this.surveys.forEach((survey: any) => (survey.dropdownOpen = false));
    }

    ngOnInit(): void {
        this.subscribeToSurveyEvents();
        this.showActiveSurveys();
    }

    subscribeToSurveyEvents() {
        this.apiService.surveyUpdated$.subscribe(() => this.showActiveSurveys());
        this.apiService.surveyEdited$.subscribe(() => this.showActiveSurveys());
        this.apiService.surveyAdded$.subscribe(() => this.showActiveSurveys());
    }

    toggleDropdown(survey: any) {
        survey.dropdownOpen = !survey.dropdownOpen;
        document.addEventListener('click', this.onClick.bind(this));
    }

    toClosedSurveys(survey: any) {
        this.bsModalRef = this.bsModalService.show(CloseSurveyComponent, { class: 'small-modal' });
        this.modalService.setupdateSurvey(survey);
        survey.dropdownOpen = false;
    }

    toLaunchNewSurvey() {
        this.apiService.getactiveSurveys().subscribe((data) => {
            this.modalService.triggerLaunchNewSurvey(data);
        });
    }

    showActiveSurveys() {
        this.apiService.getactiveSurveys().subscribe((data: any) => {
            if (Array.isArray(data)) {
                this.surveys = data.reverse().map((survey: any) => ({ ...survey, launchedOn: this.transformDate(survey.launchedOn), expiresOn: this.transformDate(survey.expiresOn) }));
            }
        });
    }

    transformDate(date: any) {
        return new DatePipe('en-US').transform(date, 'MMM dd, yyyy');
    }

    toUpdateSurvey(survey: any) {
        this.bsModalRef = this.bsModalService.show(UpdateSurveyComponent, { class: 'small-modal' });
        this.modalService.setupdateSurvey(survey);
        survey.dropdownOpen = false;
    }
}
