import { Injectable } from '@angular/core';

import { Subject, BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ModalService {
    templates: any;
    templateToUpdate: any;
    templateToDelete: any;
    updateSurvey: any;
    surveyToClose: any;
    image: any;

    private surveyUpdated = new Subject<any>();
    surveyUpdated$ = this.surveyUpdated.asObservable();

    private closeSurvey = new Subject<any>();
    closeSurveyObs$ = this.closeSurvey.asObservable();

    private openSmallModalSource = new Subject<{ survey: any; type: string }>();
    openSmallModal$ = this.openSmallModalSource.asObservable();

    private launchNewSurvey = new BehaviorSubject<number>(0);

    private updateTemplate = new Subject<any>();
    updateTemplate$ = this.updateTemplate.asObservable();

    triggerOpenSmallModal(survey: any, type: string) {
        this.openSmallModalSource.next({ survey, type });
    }

    setupdateTemplate(template: any) {
        this.templateToUpdate = template;
    }

    setImage(image: any) {
        this.image = image;
    }

    getImage() {
        return this.image;
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

    setTriggerLaunchNewSurvey(trigger:number) {
        this.launchNewSurvey.next(trigger);
    }
 
    getTriggerLaunchNewSurvey() {
        return this.launchNewSurvey;
    }

    triggerUpdateTemplate(data: any) {
        this.updateTemplate.next(data);
    }

    setCloseSurvey(survey: any) {
        this.surveyToClose = survey;
        this.closeSurvey.next(survey);
    }
}
