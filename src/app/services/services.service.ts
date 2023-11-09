import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { employee, verifyEmployee } from '../modals/modal';
import { BehaviorSubject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    originalToken: any = null;
    private surveyUpdatedSource = new BehaviorSubject<any>(null);
    surveyUpdated$ = this.surveyUpdatedSource.asObservable();

    private surveyEdited = new BehaviorSubject<any>(null);
    surveyEdited$ = this.surveyEdited.asObservable();

    private surveyAdded = new BehaviorSubject<any>(null);
    surveyAdded$ = this.surveyAdded.asObservable();

    surveyIdResponse: any;

    constructor(private http: HttpClient) {}

    setNewEmployee(empData: employee) {
        return this.http.post('https://localhost:7015/api/employee/register', empData);
    }

    getVerifyEmployee(empData: verifyEmployee) {
        return this.http.post('https://localhost:7015/api/employee/login', empData);
    }

    getClosedSurveys() {
        return this.http.get('https://localhost:7015/api/survey/closedsurveys');
    }

    getViewSurveyById(id: any) {
        return this.http.get(`https://localhost:7015/api/survey/viewsurvey/${id}`);
    }

    getAnalyticalQuestionSummaryById(id: any) {
        return this.http.get(`https://localhost:7015/api/survey/analyticalquestionsummary/${id}`);
    }

    getDetailedQuestionSummaryById(id: any){
      return this.http.get(`https://localhost:7015/api/survey/detailedquestionsummary/${id}`);
    }

    getTemplates() {
        return this.http.get('https://localhost:7015/api/template/templates');
    }

    closeSurvey(surveyId: any) {
        this.http.put(`https://localhost:7015/api/survey/closesurvey?surveyId=${surveyId}`, null).subscribe(
            (response) => {
                console.log('PUT request successful', response);
                this.surveyUpdatedSource.next(true);
            },
            (error) => {
                console.error('Error occurred during PUT request', error);
            }
        );
        this.getactiveSurveys();
    }

    updateSurvey(newSurveyData: any) {
        console.log(newSurveyData);
        this.http.put('https://localhost:7015/api/Survey/updatesurvey', newSurveyData).subscribe(
            (response) => {
                console.log('PUT request successful', response);
                this.surveyEdited.next(true);
            },
            (error) => {
                console.error('Error occurred during PUT request', error);
            }
        );
        this.getactiveSurveys();
    }

    sendSurveyQuestions(data: any, id: any) {
        this.http.post('https://localhost:7015/api/surveyquestion', data).subscribe(
            (response) => {
                console.log('POST request successful for add survey questions', response);
            },
            (error) => {
                console.error('Error occurred during PUT request', error);
            }
        );
    }

    launchNewSurvey(surveyData: any) {
        this.http.post('https://localhost:7015/api/survey', surveyData).subscribe(
            (response) => {
                console.log('POST request successful for add survey', response);
                this.surveyIdResponse = response;
                this.surveyAdded.next(true);
            },
            (error) => {
                console.error('Error occurred during PUT request', error);
            }
        );
    }

    getSurveyId() {
        return this.surveyIdResponse;
    }

    getactiveSurveys() {
        return this.http.get(`https://localhost:7015/api/survey/activesurveys`);
    }

    getOpenSurveysData(id: any) {
        return this.http.get(`https://localhost:7015/api/survey/opensurveys/${id}`);
    }

    getSurveyDetailsById(id: any) {
        return this.http.get(`https://localhost:7015/api/survey/details/${id}`);
    }

    getSurveyQuestionsById(id: any) {
        return this.http.get(`https://localhost:7015/api/surveyquestion/${id}`);
    }

    postQuestionResponses(body: any) {
        return this.http.post('https://localhost:7015/api/questionresponse/', body);
    }

    getCompletedSurveys(id: any) {
        return this.http.get(`https://localhost:7015/api/survey/completedsurveys/${id}`);
    }
}
