import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';

import * as shajs from 'sha.js';

import { Loggeduser } from '../modals/loggedUser';
import { ApiService } from '../services/api.service';
import { UserDataService } from '../services/user-data.service';

@Component({
    selector: 'app-login-employee',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './login-employee.component.html',
})
export class LoginEmployeeComponent {
    currentUser: Loggeduser = { employeeId: '', role: '', emailaddress: '', name: '', profilePicture: '' };
    loginForm!: FormGroup;
    data: any;

    constructor(private formBuilder: FormBuilder, private apiService: ApiService, private router: Router, private behaviorSubjectService: UserDataService) {}

    ngOnInit() {
        this.loginForm = this.formBuilder.group({
            email: ['', [Validators.required, Validators.email]],
            password: ['', Validators.required],
        });
    }

    onSubmit() {
        this.loginForm.value.password = shajs('sha256').update(this.loginForm.value.password).digest('hex');
        console.log(this.loginForm.value);
        this.apiService.getVerifyEmployee(this.loginForm.value).subscribe({
            next: (data) => {
                this.data = data;
                console.log(this.data);
                localStorage.setItem('token', JSON.stringify(this.data));
                let tokenString = localStorage.getItem('token');

                if (tokenString) {
                    let tokenObject = JSON.parse(tokenString);
                    console.log(tokenObject);
                }

                this.apiService.getEmployeeDetails().subscribe((Response) => {
                    this.setCurrentUser(Response);
                    this.behaviorSubjectService.setCredentials(this.currentUser);
                    this.router.navigate(['/pulseSurvey/home']);
                });
            },
            error: (e) => {
                console.error('Error occurred:', e);
                if (e.status === 400) {
                    alert('Wrong credentials');
                }
            },
        });
    }

    setCurrentUser(decodedToken: any) {
        this.currentUser.employeeId = decodedToken['EmployeeId'];
        this.currentUser.role = decodedToken['Role'];
        this.currentUser.emailaddress = decodedToken['Email'];
        this.currentUser.name = decodedToken['Name'];
    }
}
