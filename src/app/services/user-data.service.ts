import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { loggeduser } from '../modals/modal';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  private userCredentials = new BehaviorSubject<{}>({});
  private userSurveyId =new BehaviorSubject<number>(0);

  setCredentials(userData:loggeduser){
    this.userCredentials.next(userData);
  }

  getCredentials(){
    return this.userCredentials;
  }

  setSurveyId(id:number){
    console.log("setSurveyId func");
    this.userSurveyId.next(id);
  }

  getSurveyId(){
    console.log("getSurveyId func");
    return this.userSurveyId;
  }
}
