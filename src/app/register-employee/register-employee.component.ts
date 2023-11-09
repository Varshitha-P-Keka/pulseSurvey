import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

import { ServicesService } from '../services/services.service';

@Component({
    selector: 'app-register-employee',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule],
    templateUrl: './register-employee.component.html',
    styleUrls: ['./register-employee.component.scss'],
})
export class RegisterEmployeeComponent {
    registrationForm!: FormGroup;

    constructor(private fb: FormBuilder, private router: Router, private service: ServicesService) {}

    ngOnInit() {
        this.registrationForm = this.fb.group({
            EmployeeName: [''],
            PasswordHash: [''],
            Email: [''],
            ProfilePicture: [''],
            isAdmin: [false],
        });
    }

    onSubmit() {
        if (this.registrationForm.value.isAdmin === 'false') {
            this.registrationForm.value['isAdmin'] = false;
        } else {
            this.registrationForm.value['isAdmin'] = true;
        }
        this.service.setNewEmployee(this.registrationForm.value).subscribe({
          next: (data)=>{console.log(data)},
          error:(e)=>{console.log(e)}});
        this.router.navigate(['/pulseSurvey/login']);
    }
}
