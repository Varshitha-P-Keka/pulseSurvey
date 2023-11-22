import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLink } from '@angular/router';

import { ApiService } from 'src/app/services/api.service';
import { AdminAuthenticationService } from 'src/app/services/admin-authentication.service';

@Component({
    selector: 'app-left-nav',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterLink],
    templateUrl: './left-nav.component.html',
})
export class LeftNavComponent implements OnInit {
    openSurveyUrl: string = '/pulseSurvey/home/openSurveys';
    completedSurveyUrl: string = '/pulseSurvey/home/completedSurveys';
    isAdmin: boolean = true;

    constructor(public router: Router, private apiService: ApiService, private adminAuthentication: AdminAuthenticationService) {}

    ngOnInit() {
        this.apiService.getEmployeeDetails().subscribe((data: any) => {
            if (data.role == 'Admin') {
                this.isAdmin = true;
                this.adminAuthentication.isAdmin();
            } else {
                this.isAdmin = false;
                this.adminAuthentication.isNotAdmin();
            }
        });
    }
}
