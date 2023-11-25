import { Injectable } from '@angular/core';

import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class ModalService {
    templateToUpdate: any;
    templateToDelete: any;
    updateSurvey: any;
    surveyToClose: any;

    private surveyUpdated = new Subject<any>();
    surveyUpdated$ = this.surveyUpdated.asObservable();

    private closeSurvey = new Subject<any>();
    closeSurveyObs$ = this.closeSurvey.asObservable();

    private selectedItem = new BehaviorSubject<string>('');

    private updateTemplate = new Subject<any>();
    updateTemplate$ = this.updateTemplate.asObservable();

    private hideModalSubject = new Subject<any>();
    hideModal$ = this.hideModalSubject.asObservable();

    hideSmallModal() {
        this.hideModalSubject.next(null);
    }

    setSelectedItem(item:string) {
        this.selectedItem.next(item);
    }

    getSelectedItem(){
        return this.selectedItem;
    }

    setupdateTemplate(template: any) {
        this.templateToUpdate = template;
    }

    getUpdateTemplate() {
        return this.templateToUpdate;
    }

    setupdateSurvey(survey: any) {
        this.updateSurvey = survey;
        this.surveyUpdated.next(survey);
    }

    setdeleteTemplate(template: any) {
        this.templateToDelete = template;
    }

    getDeleteTemplate() {
        return this.templateToDelete;
    }

    triggerUpdateTemplate(data: any) {
        this.updateTemplate.next(data);
    }

    setCloseSurvey(survey: any) {
        this.surveyToClose = survey;
        this.closeSurvey.next(survey);
    }
}