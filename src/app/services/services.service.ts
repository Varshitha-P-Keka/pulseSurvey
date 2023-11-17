import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { employee,verifyEmployee } from '../modals/modal';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})

export class ServicesService {

  constructor(private http: HttpClient) {}
  originalToken: any = null;
  surveyIdResponse: any;
  empToken:any;

  private surveyUpdatedSource = new BehaviorSubject<any>(null);
  surveyUpdated$ = this.surveyUpdatedSource.asObservable();
 
  getVerifyEmployee(empData:verifyEmployee) {
    return this.http.post('https://localhost:7015/api/Employee/login',empData);
  }

  getEmployeeDetails() {
    let tokenString = localStorage.getItem('token');
    if (tokenString) {
      let tokenObject = JSON.parse(tokenString);
      this.empToken = tokenObject;
      // console.log('hihihih',this.empToken.token);
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.empToken['token']}`);
    return this.http.get('https://localhost:7015/api/employee/employeedetails', { headers });
  }
  
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
    
  setNewEmployee(empData: employee) {
    return this.http.post('https://localhost:7015/api/employee/register', empData);
  }

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

  getViewSurveyById(id: any) {
    return this.http.get(`https://localhost:7015/api/survey/viewsurvey/${id}`);
}

  updateSurvey(newSurveyData:any){
    return this.http.put('https://localhost:7015/api/Survey/updatesurvey',newSurveyData ).subscribe((response) => {this.surveyEdited.next(true)});
  }

  getClosedSurveys() {
    return this.http.get('https://localhost:7015/api/survey/closedsurveys');
}

  sendSurveyQuestions(data:any){  
    let tokenString = localStorage.getItem('token');
    if (tokenString) {
      let tokenObject = JSON.parse(tokenString);
      this.empToken = tokenObject;
    }
    console.log(data)
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.empToken['token']}`);
    this.http.post('https://localhost:7015/api/survey',data,{headers} ).subscribe((response) => {this.surveyAdded.next(true);});
  }

    getDetailedQuestionSummaryById(id: any){
      return this.http.get(`https://localhost:7015/api/survey/detailedquestionsummary/${id}`);
    }

    getAnalyticalQuestionSummaryById(id: any){
      return this.http.get(`https://localhost:7015/api/survey/analyticalquestionsummary/${id}`);
    }

    getSurveyId() {
        return this.surveyIdResponse;
    }

    getactiveSurveys() {
        return this.http.get(`https://localhost:7015/api/survey/activesurveys`);
    }

  getOpenSurveysData() {
    let tokenString = localStorage.getItem('token');
    if (tokenString) {
      let tokenObject = JSON.parse(tokenString);
      this.empToken = tokenObject;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.empToken['token']}`);
      return this.http.get(`https://localhost:7015/api/survey/opensurveys`, { headers });
  }

  getSurveyDetailsById(id: any) {
      return this.http.get(`https://localhost:7015/api/survey/details/${id}`);
  }

  getSurveyQuestionsById(id: any) {
      return this.http.get(`https://localhost:7015/api/surveyquestion/${id}`);
  }

  postQuestionResponses(body: any) {
    let tokenString = localStorage.getItem('token');
    if (tokenString) {
      let tokenObject = JSON.parse(tokenString);
      this.empToken = tokenObject;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.empToken['token']}`);
      return this.http.post('https://localhost:7015/api/questionresponse/', body,{headers});
  }

  getCompletedSurveys(id: any) {
    let tokenString = localStorage.getItem('token');
    if (tokenString) {
      let tokenObject = JSON.parse(tokenString);
      this.empToken = tokenObject;
    }
    const headers = new HttpHeaders().set('Authorization', `Bearer ${this.empToken['token']}`);
      return this.http.get(`https://localhost:7015/api/survey/completedsurveys/`,{headers});
  }
}
