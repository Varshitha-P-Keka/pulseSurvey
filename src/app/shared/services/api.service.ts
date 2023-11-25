import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';

import { BehaviorSubject } from 'rxjs';

import { Employee, VerifyEmployee } from '../../shared';
import { SpinnerVisibilityService } from 'ng-http-loader';

@Injectable({
    providedIn: 'root',
})

export class ApiService {
    token: any;
    surveyIdResponse: any;
    baseUrl: string = 'https://localhost:7015/api/';

    private surveyUpdatedSource = new BehaviorSubject<any>(null);
    surveyUpdated$ = this.surveyUpdatedSource.asObservable();

    private surveyEdited = new BehaviorSubject<any>(null);
    surveyEdited$ = this.surveyEdited.asObservable();

    private surveyAdded = new BehaviorSubject<any>(null);
    surveyAdded$ = this.surveyAdded.asObservable();

    private templateAdded = new BehaviorSubject<any>(null);
    templateAdded$ = this.templateAdded.asObservable();

    private templateUpdated = new BehaviorSubject<any>(null);
    templateUpdated$ = this.templateUpdated.asObservable();

    private templateDeleted = new BehaviorSubject<any>(null);
    templateDeleted$ = this.templateDeleted.asObservable();

    constructor(private http: HttpClient, private spinner: SpinnerVisibilityService) {}

    loginEmployee(empData: VerifyEmployee) {
        this.spinner.show();
        return this.http.post(`${this.baseUrl}Employee/login`, empData);
    }

    getEmployeeDetails() {
        this.spinner.show();
        this.token = JSON.parse(<string>localStorage.getItem('token')).token;
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}employee/employeedetails`, { headers });
    }

    setNewEmployee(empData: Employee) {
        this.spinner.show();
        return this.http.post(`${this.baseUrl}employee/register`, empData);
    }

    getTemplates() {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}template`, { headers });
    }

    deleteTemplate(templateId: any) {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.delete(`${this.baseUrl}template/${templateId}`, { headers }).subscribe((response) => {
            this.spinner.hide();
            this.templateDeleted.next(true);
        });
    }

    updateTemplate(templateData: any) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.put(`${this.baseUrl}template`, templateData, { headers }).subscribe((response) => {
            this.spinner.hide();
            this.templateUpdated.next(true);
        });
    }

    addNewTemplate(template: any) {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        this.http.post(`${this.baseUrl}template`, template, { headers }).subscribe((response) => {
            this.spinner.hide();
            this.templateAdded.next(true);
        });
    }

    getTemplateQuestions(id: any) {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}templatequestion/${id}`, { headers });
    }

    closeSurvey(surveyId: any) {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.put(`${this.baseUrl}survey/closesurvey/${surveyId}`, null, { headers }).subscribe((response) => {
            this.spinner.hide();
            this.surveyUpdatedSource.next(true);
        });
    }

    getViewSurveyById(id: any) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}survey/viewsurvey/${id}`, { headers });
    }

    updateSurvey(newSurveyData: any) {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.put(`${this.baseUrl}survey/updatesurvey`, newSurveyData, { headers }).subscribe((response) => {
            this.spinner.hide();
            this.surveyEdited.next(true);
        });
    }

    reLaunchSurvey(survey:any) {
        this.spinner.show();
        return this.http.put(`${this.baseUrl}survey/relaunchsurvey`, survey,).subscribe((response) => {
            this.spinner.hide();
            this.surveyEdited.next(true);
        });
    }

    getClosedSurveys() {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}survey/closedsurveys`, { headers });
    }

    sendSurveyQuestions(data: any) {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        this.http.post(`${this.baseUrl}survey`, data, { headers }).subscribe((response) => {
            this.spinner.hide();
            this.surveyAdded.next(true);
        });
    }

    getDetailedQuestionSummaryById(id: any) {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}survey/detailedquestionsummary/${id}`, { headers });
    }

    getAnalyticalQuestionSummaryById(id: any) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}survey/analyticalquestionsummary/${id}`, { headers });
    }

    getSurveyId() {
        return this.surveyIdResponse;
    }

    getactiveSurveys() {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}survey/activesurveys`, { headers });
    }

    getOpenSurveysData() {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}survey/opensurveys`, { headers });
    }

    getSurveyDetailsById(id: any) {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}survey/details/${id}`, { headers });
    }

    getSurveyQuestionsById(id: any) {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}surveyquestion/${id}`, { headers });
    }

    postQuestionResponses(body: any) {
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.post(`${this.baseUrl}questionresponse/`, body, { headers });
    }

    getCompletedSurveys() {
        this.spinner.show();
        const headers = new HttpHeaders().set('Authorization', `Bearer ${this.token}`);
        return this.http.get(`${this.baseUrl}survey/completedsurveys`, { headers });
    }
}