import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ApiService, ModalService, updateSurveyData } from '../../../../../shared';
import { ActiveSurveysComponent } from '../../active-surveys/active-surveys.component';

@Component({
    selector: 'app-relaunch-survey',
    standalone: true,
    imports: [CommonModule, RouterLink, BsDatepickerModule, ReactiveFormsModule, ActiveSurveysComponent, FormsModule],
    providers: [BsModalService, BsDatepickerConfig],
    templateUrl: './relaunch-survey.component.html',
})

export class RelaunchSurveyComponent implements OnInit {
    constructor(private apiService: ApiService, public bsModalService: BsModalService, private modalService: ModalService, private formBuilder: FormBuilder, private datePipe: DatePipe, public bsModalRef: BsModalRef) {}
    private surveyUpdatedSource = new BehaviorSubject<any>(null);
    surveyToUpdate: any;
    activeSurveysComponent: any;
    updateSurveyForm!: FormGroup;
    date: any;
    surveyUpdated$ = this.surveyUpdatedSource.asObservable();
    bsConfig: Partial<BsDatepickerConfig> = {
        showWeekNumbers: false,
    };
    ModalRef!: BsModalRef | undefined;
    survey: any;

    ngOnInit(): void {
        this.initializeUpdateSurveyForm();
        this.subscribeToEvents();      
    }

    private initializeUpdateSurveyForm():void {
        this.updateSurveyForm = this.formBuilder.group({
            surveyName: [''],
            surveyDescription: [''],
            surveyExpiry: [''],
        });
    }

    private subscribeToEvents():void {
        this.modalService.surveyUpdated$.subscribe((survey) => {
            this.surveyToUpdate = survey;
            if (this.surveyToUpdate) {
                this.updateSurveyForm.patchValue({
                    surveyName: this.surveyToUpdate.surveyTitle,
                    surveyDescription: this.surveyToUpdate.surveyDescription,
                    surveyExpiry: this.datePipe.transform(this.surveyToUpdate.expiresOn, 'MM/dd/yyyy'),
                });
            }
        });
    }  

    onSubmit():void {
        const updatedSurvey = new updateSurveyData (
            this.surveyToUpdate.surveyId,
            this.updateSurveyForm.value.surveyName,
            this.updateSurveyForm.value.surveyDescription,
            this.formatDate(this.updateSurveyForm.value.surveyExpiry)
        );
        this.apiService.reLaunchSurvey(updatedSurvey);
        this.hideModal();
    }

    formatDate(date: any):string {
        let fdate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS');
        return fdate + 'Z';
    }

    hideModal():void {
        this.bsModalRef.hide();
    }
}