import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { DatePipe, CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, FormsModule } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ApiService } from 'src/app/services/api.service';
import { ModalService } from 'src/app/services/modal-service.service';
import { ActiveSurveysComponent } from 'src/app/admin/surveys/active-surveys/active-surveys.component';

@Component({
    selector: 'app-relaunch-survey',
    standalone: true,
    imports: [CommonModule, RouterLink, BsDatepickerModule, ReactiveFormsModule, ActiveSurveysComponent, FormsModule],
    providers: [BsModalService, BsDatepickerConfig],
    templateUrl: './relaunch-survey.component.html',
})
export class RelaunchSurveyComponent implements OnInit {
    private surveyUpdatedSource = new BehaviorSubject<any>(null);
    surveyToUpdate: any;
    activeSurveysComponent: any;
    updateSurveyForm!: FormGroup;
    date: any;
    surveyUpdated$ = this.surveyUpdatedSource.asObservable();

    constructor(private apiService: ApiService, public bsModalService: BsModalService, private modalService: ModalService, private formBuilder: FormBuilder, private datePipe: DatePipe, public bsModalRef: BsModalRef) {
        this.bsConfig = Object.assign({}, { containerClass: 'theme-default' });
        this.bsConfig = {
            showWeekNumbers: false,
        };
    }

    ngOnInit(): void {
        this.updateSurveyForm = this.formBuilder.group({
            surveyName: [''],
            surveyDescription: [''],
            surveyExpiry: [''],
        });

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

    bsConfig: Partial<BsDatepickerConfig> = {
        showWeekNumbers: false,
    };

    ModalRef!: BsModalRef | undefined;
    survey: any;

    onSubmit() {
        let updatedSurveyData = {
            surveyId: this.surveyToUpdate.surveyId,
            surveyTitle: this.updateSurveyForm.value.surveyName,
            surveyDescription: this.updateSurveyForm.value.surveyDescription,
            expiresOn: this.formatDate(this.updateSurveyForm.value.surveyExpiry),
        };
        this.apiService.updateSurvey(updatedSurveyData);
        this.hideModal();
    }

    formatDate(date: any) {
        let fdate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS');
        return fdate + 'Z';
    }

    hideModal() {
        this.bsModalRef.hide();
    }
}
