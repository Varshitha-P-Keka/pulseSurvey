import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import { SpinnerVisibilityService } from 'ng-http-loader';
import * as shajs from 'sha.js';

import { Loggeduser } from '../../shared/models/loggedUser.model';
import { ApiService } from '../../shared/services/api.service';
import { UserDataService } from '../../shared/services/user-data.service';

@Component({
    selector: 'app-login-employee',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login-employee.component.html',
})

export class LoginEmployeeComponent {
    constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router, private behaviorSubjectService: UserDataService, private spinner: SpinnerVisibilityService) {}
    currentUser: Loggeduser = new Loggeduser('', '', '', '', '');
    loginForm!: FormGroup;

    ngOnInit() {
        this.initialzeLoginForm();
    }

    private initialzeLoginForm() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    onSubmit(): void {
        const hashedPassword = shajs('sha256').update(this.loginForm.value.password).digest('hex');
        this.loginForm.value.password = hashedPassword;

        this.apiService.loginEmployee(this.loginForm.value).subscribe({
          next: (data) => {
            this.spinner.hide();
            localStorage.setItem('token', JSON.stringify(data));
            this.fetchEmployeeDetailsAndNavigate();
          },
          error: (e) => {
            if (e.status === 400) alert('Wrong credentials');            
          },
        });
    }
      
    fetchEmployeeDetailsAndNavigate(): void {
        this.apiService.getEmployeeDetails().subscribe((response) => {
            this.spinner.hide();
            this.setCurrentUser(response);
            this.behaviorSubjectService.setCredentials(this.currentUser);
            this.router.navigate(['/pulseSurvey/home']);
        });
    }      

    setCurrentUser(decodedToken: any):void {
        this.currentUser.employeeId = decodedToken['EmployeeId'];
        this.currentUser.role = decodedToken['Role'];
        this.currentUser.emailaddress = decodedToken['Email'];
        this.currentUser.name = decodedToken['Name'];
    }
}