import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { employee,verifyEmployee } from '../modals/modal';

@Injectable({
  providedIn: 'root'
})
export class ServicesService {

  constructor( private http:HttpClient) { }

  setNewEmployee(empData:employee){
    return this.http.post('https://localhost:7015/api/Employee/register',empData);
  }

  getVerifyEmployee(empData:verifyEmployee){
    return this.http.post('https://localhost:7015/api/Employee/login',empData);
  }

  getOpenSurveysData(id:any){
    return this.http.get('https://localhost:7015/api/Survey/getopensurveys/'+id);
  }

  getSurveyDetailsById(id:any){
    return this.http.get('https://localhost:7015/api/Survey/details/'+id);
  }

  getSurveyQuestionsById(id:any){
    return this.http.get('https://localhost:7015/api/SurveyQuestion/getsurveyquestions/'+id);
  }

  postQuestionResponses(body:any){
    return this.http.post('https://localhost:7015/api/QuestionResponse/responses',body);
  }

  getCompletdSurveys(id:number){
    return this.http.get('https://localhost:7015/api/Survey/getcompletedsurveys/'+id);
  }

}
