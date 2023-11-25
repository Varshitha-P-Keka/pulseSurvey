import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import * as shajs from 'sha.js';
import { ToastrModule, ToastrService } from 'ngx-toastr';
import { SpinnerVisibilityService } from 'ng-http-loader';

import { ApiService } from '../../shared/services/api.service';
import { ModalService } from '../../shared/services/modal-service.service';

@Component({
    selector: 'app-register-employee',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, ToastrModule],
    providers: [ToastrService],
    templateUrl: './register-employee.component.html',
})

export class RegisterEmployeeComponent {
    constructor(private formBuider: FormBuilder, private toastr: ToastrService, private router: Router, private apiService: ApiService, private modalService: ModalService, private spinner: SpinnerVisibilityService) {}
    registrationForm!: FormGroup;
    selectedFile: any;

    ngOnInit() {
        this.registrationForm = this.formBuider.group({
            EmployeeName: ['', [Validators.required, Validators.pattern(/^[a-zA-Z\s]*$/)]],
            PasswordHash: ['', Validators.required],
            Email: ['', [Validators.required, Validators.email]],
            ProfilePicture: [''],
            isAdmin: [],
        });
    }

    onSubmit():void {
        if (this.registrationForm.value.isAdmin === 'false') {
            this.registrationForm.value['isAdmin'] = false;
        } else {
            this.registrationForm.value['isAdmin'] = true;
        }

        this.registrationForm.value.PasswordHash = shajs('sha256').update(this.registrationForm.value.PasswordHash).digest('hex');
        this.registrationForm.value.ProfilePicture = this.selectedFile;
        this.apiService.setNewEmployee(this.registrationForm.value).subscribe({
            next: (data) => {
                this.spinner.hide();
                this.router.navigate(['/pulseSurvey/login']);
            },
            error: (e) => {
                if (e.status === 409) {
                    alert('User Already exists');
                } else {
                }
            },
        });
    }
    
    onFileSelected(event: Event):void {
      const element = event.target as HTMLInputElement;
      const files = element.files![0];
      if (files) {
          const reader = new FileReader();
          reader.onload = (event: any) => {
              this.selectedFile = event.target.result;
          };
          reader.readAsDataURL(files);
        }
    }
}