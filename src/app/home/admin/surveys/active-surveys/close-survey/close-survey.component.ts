import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService,ModalService } from '../../../../../shared';

@Component({
    selector: 'app-close-survey',
    standalone: true,
    imports: [CommonModule],
    providers: [BsModalService],
    templateUrl: './close-survey.component.html',
})
export class CloseSurveyComponent implements OnInit {
    constructor(private apiService: ApiService, private modalService: ModalService, public bsModalRef: BsModalRef) {}
    modalRef!: BsModalRef;
    survey: any;

    ngOnInit(): void {
        this.modalService.surveyUpdated$.subscribe((survey) => { 
            this.survey = survey;
        });
    }

    hideModal():void {
        this.bsModalRef.hide();
    }

    toCloseSurvey():void {
        this.apiService.closeSurvey(this.survey.surveyId);
        this.hideModal();
    }
}