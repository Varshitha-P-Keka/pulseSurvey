import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ServicesService } from '../services/services.service';
import { UserDataService } from '../services/user-data.service';
import jwt_decode from 'jwt-decode';
import { loggeduser } from '../modals/modal';

@Component({
    selector: 'app-login-employee',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login-employee.component.html'
})

export class LoginEmployeeComponent {
  currentUser:loggeduser={employeeId:'',role:'',emailaddress:'',name:''}
  loginForm!:FormGroup;
  data:any;

  constructor(private fb:FormBuilder,private service:ServicesService, private router:Router, private udService:UserDataService){}

  ngOnInit(){
    this.loginForm = this.fb.group({
      email:['',Validators.required],
      password:['',Validators.required]
    })
  }

  onSubmit(){
    this.service.getVerifyEmployee(this.loginForm.value).subscribe({
      next:(data)=>{
        this.data = data;
        const decodedToken = <any>jwt_decode(this.data.token);
        this.setCurrentUser(decodedToken);
        this.udService.setCredentials(this.currentUser);
         this.router.navigate(['/pulseSurvey/home']);
      }})
    this.router.navigate(['/pulseSurvey/home']);
  }

  setCurrentUser(decodedToken:any){
    this.currentUser.employeeId=decodedToken['EmployeeId'];
    this.currentUser.role=decodedToken['Role'];
    this.currentUser.emailaddress=decodedToken['Email'];
    this.currentUser.name=decodedToken['Name'];
  }
}