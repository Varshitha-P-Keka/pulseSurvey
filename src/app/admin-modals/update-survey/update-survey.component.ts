import { RouterLink } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule, ReactiveFormsModule, FormBuilder, FormGroup } from '@angular/forms';

import { BehaviorSubject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { ApiService } from 'src/app/services/api.service';
import { updateSurveyData } from '../../modals/updateSurveyModal';
import { ModalService } from 'src/app/services/modal-service.service';

@Component({
    selector: 'app-update-survey',
    standalone: true,
    imports: [CommonModule, RouterLink, BsDatepickerModule, ReactiveFormsModule, FormsModule],
    providers: [BsModalService, BsDatepickerConfig],
    templateUrl: './update-survey.component.html',
})
export class UpdateSurveyComponent implements OnInit {
    surveyToUpdate: any;
    updateSurveyForm!: FormGroup;
    ModalRef!: BsModalRef | undefined;
    private surveyUpdatedSource = new BehaviorSubject<any>(null);
    surveyUpdated$ = this.surveyUpdatedSource.asObservable();

    constructor(private apiService: ApiService, public bsModalService: BsModalService, private modalService: ModalService, private formBuilder: FormBuilder, private datePipe: DatePipe, public bsModalRef: BsModalRef) {}

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

    onSubmit() {
        let updatedSurveyData = new updateSurveyData(this.surveyToUpdate.surveyId, this.updateSurveyForm.value.surveyName, this.updateSurveyForm.value.surveyDescription, this.formatDate(this.updateSurveyForm.value.surveyExpiry));
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
