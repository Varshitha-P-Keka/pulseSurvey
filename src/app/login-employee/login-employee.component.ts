import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder,FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ServicesService } from '../services/services.service';
import { UserDataService } from '../services/user-data.service';
import jwt_decode from 'jwt-decode';
import * as shajs from 'sha.js';
import { loggeduser } from '../modals/modal';

@Component({
    selector: 'app-login-employee',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login-employee.component.html'
})

export class LoginEmployeeComponent {
  currentUser:loggeduser={employeeId:'',role:'',emailaddress:'',name:'',profilePicture:''}
  loginForm!:FormGroup;
  data:any;

  constructor(private fb:FormBuilder,private service:ServicesService, private router:Router, private udService:UserDataService){}

  ngOnInit() {
    this.loginForm = this.fb.group({
      email:['', [Validators.required, Validators.email]],
      password:['',Validators.required]
    })
  }

  onSubmit() {
    this.loginForm.value.password = shajs('sha256').update(this.loginForm.value.password).digest('hex');
    console.log(this.loginForm.value);
    this.service.getVerifyEmployee(this.loginForm.value).subscribe({
      next: (data) => {
        this.data = data;
        console.log(this.data);
        localStorage.setItem('token',JSON.stringify(this.data));
        let tokenString = localStorage.getItem('token');

    if (tokenString) {
      let tokenObject = JSON.parse(tokenString);
      console.log(tokenObject);
    }

        this.service.getEmployeeDetails().subscribe((Response)=>{
          this.setCurrentUser(Response);
          this.udService.setCredentials(this.currentUser);
          this.router.navigate(['/pulseSurvey/home']);
        })
      },
      error: (e) => {
        console.error('Error occurred:', e);
        if (e.status === 400) {
          alert('Wrong credentials');
        }
      },
    });
  }  

  setCurrentUser(decodedToken:any) {
    this.currentUser.employeeId=decodedToken['EmployeeId'];
    this.currentUser.role=decodedToken['Role'];
    this.currentUser.emailaddress=decodedToken['Email'];
    this.currentUser.name=decodedToken['Name'];
  }
}