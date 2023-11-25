import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService, UserDataService } from '../../../../shared';
import { DetailsComponent, SurveyQuestionsComponent, SmallModalSurveyConfirmationComponent } from '../full-modal-take-survey-details';

@Component({
    selector: 'app-full-modal-take-survey-details',
    standalone: true,
    imports: [CommonModule, DetailsComponent, SurveyQuestionsComponent, SmallModalSurveyConfirmationComponent],
    templateUrl: './full-modal-take-survey-details.component.html',
})

export class FullModalTakeSurveyDetailsComponent {
    isRequired: boolean = true;
    surveyId: any = 0;
    surveyDetails: any;
    tab: string = 'details';
    subheadNavActive: boolean = true;
    modalRef: BsModalRef | undefined;

    constructor(public bsModalRef: BsModalRef, private behaviorSubjectService: UserDataService, private apiService: ApiService, private modalService: BsModalService, private spinner: SpinnerVisibilityService) {}

    ngOnInit():void {
        this.behaviorSubjectService.getSurveyId().subscribe({
            next: (data) => {
                this.surveyId = data;
            },
            error: (e) => {},
        });

        this.behaviorSubjectService.getRequiredArray().subscribe({
            next: (data:any)=>{
                    for(let i=0;i<data.length;++i)
                    if(data[i].isRequired){
                        this.isRequired = true;
                        break;
                    }
                     else{
                         this.isRequired = false;
                     }
            }
        })

        if (this.surveyId) {
            this.apiService.getSurveyDetailsById(this.surveyId).subscribe({
                next: (data) => {
                    this.spinner.hide();
                    this.surveyDetails = data;
                },
                error: (e) => {},
            });
        }
    }

    openSurveyQuestions():void {
        this.tab = 'surveyQuestions';
        this.subheadNavActive = false;
    }

    modalHide():void {
        this.bsModalRef.hide();
    }

    navigateToDetails():void {
        this.tab = 'details';
        this.subheadNavActive = true;
    }

    confirmationModal():void {
        this.modalRef = this.modalService.show(SmallModalSurveyConfirmationComponent, { class: 'small-modal' });
    }
}