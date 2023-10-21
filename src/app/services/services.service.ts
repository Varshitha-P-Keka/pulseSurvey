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
}
