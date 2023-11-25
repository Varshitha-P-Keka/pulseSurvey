import { Component } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterOutlet, RouterModule } from '@angular/router';

import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService,ModalService } from '../../../../shared';
import { UpdateSurveyComponent,CloseSurveyComponent,LaunchSurveyComponent } from '../active-surveys';

@Component({
    selector: 'app-active-surveys',
    standalone: true,
    imports: [CommonModule, RouterOutlet, UpdateSurveyComponent, CloseSurveyComponent, RouterModule,LaunchSurveyComponent],
    providers: [BsModalService],
    templateUrl: './active-surveys.component.html',
})

export class ActiveSurveysComponent {
    constructor(private apiService: ApiService, public bsModalService: BsModalService, private modalService: ModalService, private spinner: SpinnerVisibilityService) {}
    activeSurveys: any;
    bsModalRef!: BsModalRef;
    surveys: any;
    dropdownOpen: boolean = false;

    ngOnInit(): void {
        this.subscribeToSurveyEvents();
        this.showActiveSurveys();
    }

    private onClick(event: Event):void {
        if (!this.isClickedInside(event)) {
            this.surveys.forEach((survey: any) => (survey.dropdownOpen = false));
        }
    }

    private isClickedInside(event: Event): boolean {
        return !!(event.target as HTMLElement).closest('.dropdown');
    }

    private subscribeToSurveyEvents():void {
        this.apiService.surveyUpdated$.subscribe(() => this.showActiveSurveys());
        this.apiService.surveyEdited$.subscribe(() => this.showActiveSurveys());
        this.apiService.surveyAdded$.subscribe(() => this.showActiveSurveys());
    }

    toggleDropdown(survey: any):void {
        survey.dropdownOpen = !survey.dropdownOpen;
        document.addEventListener('click', this.onClick.bind(this));
    }

    toClosedSurveys(survey: any):void {
        this.bsModalRef = this.bsModalService.show(CloseSurveyComponent, { class: 'small-modal' });
        this.modalService.setupdateSurvey(survey);
        survey.dropdownOpen = false;
    }

    toLaunchNewSurvey():void {
        this.bsModalRef = this.bsModalService.show(LaunchSurveyComponent, { class: 'small-modal' });
    }

    private showActiveSurveys():void {
        this.apiService.getactiveSurveys().subscribe((data: any) => {
            this.spinner.hide();
            if (Array.isArray(data)) {
                this.surveys = data.reverse().map((survey: any) => ({ ...survey, launchedOn: this.transformDate(survey.launchedOn), expiresOn: this.transformDate(survey.expiresOn) }));
            }
        });
    }

    transformDate(date: any):string | null {
        return new DatePipe('en-US').transform(date, 'MMM dd, yyyy');
    }

    toUpdateSurvey(survey: any):void {
        this.bsModalRef = this.bsModalService.show(UpdateSurveyComponent, { class: 'small-modal' });
        this.modalService.setupdateSurvey(survey);
        survey.dropdownOpen = false;
    }
}