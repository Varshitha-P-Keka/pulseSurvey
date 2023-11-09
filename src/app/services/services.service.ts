import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
<<<<<<< HEAD
import { employee,verifyEmployee } from '../modals/modal';
=======

import { employee, verifyEmployee } from '../modals/modal';
>>>>>>> upstream/master
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ServicesService {
<<<<<<< HEAD
  constructor(private http: HttpClient) {}
  originalToken: any = null;
  surveyIdResponse: any;

  private surveyUpdatedSource = new BehaviorSubject<any>(null);
  surveyUpdated$ = this.surveyUpdatedSource.asObservable();
=======
    originalToken: any = null;
    private surveyUpdatedSource = new BehaviorSubject<any>(null);
    surveyUpdated$ = this.surveyUpdatedSource.asObservable();
>>>>>>> upstream/master

    private surveyEdited = new BehaviorSubject<any>(null);
    surveyEdited$ = this.surveyEdited.asObservable();

    private surveyAdded = new BehaviorSubject<any>(null);
    surveyAdded$ = this.surveyAdded.asObservable();

    surveyIdResponse: any;

<<<<<<< HEAD
  private templateAdded = new BehaviorSubject<any>(null);
  templateAdded$ = this.templateAdded.asObservable();
=======
    constructor(private http: HttpClient) {}
>>>>>>> upstream/master

  private templateUpdated = new BehaviorSubject<any>(null);
  templateUpdated$ = this.templateUpdated.asObservable();

  private templateDeleted = new BehaviorSubject<any>(null);
  templateDeleted$ = this.templateDeleted.asObservable();
    
  setNewEmployee(empData: employee) {
    return this.http.post('https://localhost:7015/api/employee/register', empData);
  }

<<<<<<< HEAD
  getTemplates() {
    return this.http.get(' https://localhost:7015/api/template');
  }

  deleteTemplate(templateId:any) {
    return this.http.delete(`https://localhost:7015/api/template/${templateId}`).subscribe((response) => {this.templateDeleted.next(true)});
  }

  updateTemplate (templateData:any) {
    return  this.http.put('https://localhost:7015/api/template',templateData ).subscribe((response) => {this.templateUpdated.next(true)});
  }

  addNewTemplate(template:any) {
    this.http.post('https://localhost:7015/api/template',template ).subscribe((response) => {this.templateAdded.next(true)});
  }
  
  getTemplateQuestions(id:any) {
    return this.http.get(`https://localhost:7015/api/templatequestion/${id}`);
  }

  closeSurvey(surveyId:any){
    return this.http.put(`https://localhost:7015/api/survey/closesurvey/${surveyId}`, null).subscribe((response) => {this.surveyUpdatedSource.next(true)});
  }

  updateSurvey(newSurveyData:any){
    return this.http.put('https://localhost:7015/api/Survey/updatesurvey',newSurveyData ).subscribe((response) => {this.surveyEdited.next(true)});
  }

  sendSurveyQuestions(data:any){  
    this.http.post('https://localhost:7015/api/survey',data ).subscribe((response) => {this.surveyAdded.next(true);});
  }
=======
    getClosedSurveys() {
        return this.http.get('https://localhost:7015/api/survey/closedsurveys');
    }

    getViewSurveyById(id: any) {
        return this.http.get(`https://localhost:7015/api/survey/viewsurvey/${id}`);
    }

    getAnalyticalQuestionSummaryById(id: any) {
        return this.http.get(`https://localhost:7015/api/survey/analyticalquestionsummary/${id}`);
    }
>>>>>>> upstream/master

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

<<<<<<< HEAD
  getactiveSurveys() {
    return this.http.get(`https://localhost:7015/api/survey/activesurveys`);
  } 
  getOpenSurveysData(id: any) {
      return this.http.get(`https://localhost:7015/api/survey/opensurveys/${id}`);
  }
=======
    getOpenSurveysData(id: any) {
        return this.http.get(`https://localhost:7015/api/survey/opensurveys/${id}`);
    }
>>>>>>> upstream/master

  getSurveyDetailsById(id: any) {
      return this.http.get(`https://localhost:7015/api/survey/details/${id}`);
  }

  getSurveyQuestionsById(id: any) {
      return this.http.get(`https://localhost:7015/api/surveyquestion/${id}`);
  }

  postQuestionResponses(body: any) {
      return this.http.post('https://localhost:7015/api/questionresponse/', body);
  }

<<<<<<< HEAD
  getCompletedSurveys(id: any) {
      return this.http.get(`https://localhost:7015/api/survey/completedsurveys/${id}`);
  }
=======
    getCompletedSurveys(id: any) {
        return this.http.get(`https://localhost:7015/api/survey/completedsurveys/${id}`);
    }
>>>>>>> upstream/master
}
