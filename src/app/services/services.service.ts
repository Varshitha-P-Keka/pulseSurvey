import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { employee, verifyEmployee } from '../modals/modal';

@Injectable({
    providedIn: 'root',
})
export class ServicesService {
    constructor(private http: HttpClient) {}

    setNewEmployee(empData: employee) {
        return this.http.post('https://localhost:7015/api/employee/register', empData);
    }

    getVerifyEmployee(empData: verifyEmployee) {
        return this.http.post('https://localhost:7015/api/employee/login', empData);
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
