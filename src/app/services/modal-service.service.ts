import { Injectable, TemplateRef } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ModalServiceService {
  
  private openSmallModalSource = new Subject<{ survey: any; type: string; }>();
  openSmallModal$ = this.openSmallModalSource.asObservable();

  private launchNewSurvey = new Subject<any>();
  launchNewSurvey$ = this.launchNewSurvey.asObservable();

  triggerOpenSmallModal(survey: any, type: string) {
    this.openSmallModalSource.next({ survey, type });
  }

  triggerLaunchNewSurvey(data:any){
    console.log('trigger launch new survey in service works')
    this.launchNewSurvey.next(data);
  }

  constructor() { }
}
