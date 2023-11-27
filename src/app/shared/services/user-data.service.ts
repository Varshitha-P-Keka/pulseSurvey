import { Injectable } from '@angular/core';

import { BehaviorSubject } from 'rxjs';

import { Loggeduser } from '../../shared';

@Injectable({
    providedIn: 'root',
})

export class UserDataService {
    private userCredentials = new BehaviorSubject<{}>({});
    private userSurveyId = new BehaviorSubject<number>(0);
    private userSurveyQuestions = new BehaviorSubject<boolean>(false);
    private viewSurveyId = new BehaviorSubject<number>(0);
    private viewClosedSurveyId = new BehaviorSubject<{}>({});
    private applicationTheme = new BehaviorSubject<string>('');
    private isRequiredSurveyQuestions = new BehaviorSubject<{}[]> ([]);

    setRequiredArray(isRequired: {}[]) {
        this.isRequiredSurveyQuestions.next(isRequired);
    }

    getRequiredArray(){
        return this.isRequiredSurveyQuestions;
    }

    setCredentials(userData: Loggeduser) {
        this.userCredentials.next(userData);
    }

    getCredentials() {
        return this.userCredentials;
    }

    setSurveyId(id: number) {
        this.userSurveyId.next(id);
    }

    getSurveyId() {
        return this.userSurveyId;
    }

    setSurveyQuestionsConfirmation(flag: boolean) {
        this.userSurveyQuestions.next(flag);
    }

    getSurveyQuestionsConfirmation() {
        return this.userSurveyQuestions;
    }

    setViewSurveyId(id: number) {
        this.viewSurveyId.next(id);
    }

    getViewSurveyId() {
        return this.viewSurveyId;
    }

    setViewClosedSurveyId(data: {}) {
        this.viewClosedSurveyId.next(data);
    }

    getViewClosedSurveyId() {
        return this.viewClosedSurveyId;
    }

    setTheme(theme: string) {
        this.applicationTheme.next(theme);
    }

    getTheme() {
        return this.applicationTheme;
    }
}