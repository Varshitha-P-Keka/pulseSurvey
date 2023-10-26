import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { loggeduser } from '../modals/modal';

@Injectable({
  providedIn: 'root'
})
export class UserDataService {

  constructor() { }

  private userCredentials = new BehaviorSubject<{}>({});

  setCredentials(userData:loggeduser){
    this.userCredentials.next(userData);
  }

  getCredentials(){
    return this.userCredentials;
  }
}
