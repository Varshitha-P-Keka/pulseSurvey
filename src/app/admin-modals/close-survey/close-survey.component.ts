import { RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ApiService } from 'src/app/services/api.service';
import { ModalService } from 'src/app/services/modal-service.service';

@Component({
    selector: 'app-close-survey',
    standalone: true,
    imports: [CommonModule, RouterLink, BsDatepickerModule, ReactiveFormsModule],
    providers: [BsModalService, BsDatepickerConfig],
    templateUrl: './close-survey.component.html',
})
export class CloseSurveyComponent implements OnInit {
    modalRef!: BsModalRef;
    survey: any;

    constructor(private apiService: ApiService, private modalService: ModalService, public bsModalRef: BsModalRef) {}

    ngOnInit(): void {
        this.modalService.surveyUpdated$.subscribe((survey) => {
            this.survey = survey;
        });
    }

    hideModal() {
        this.bsModalRef.hide();
    }

    closeSurvey() {
        this.apiService.closeSurvey(this.survey.surveyId);
        this.hideModal();
    }
}
