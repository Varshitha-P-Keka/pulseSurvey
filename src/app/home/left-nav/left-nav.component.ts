import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule, RouterLink } from '@angular/router';

import { SpinnerVisibilityService } from 'ng-http-loader';

import { ApiService,AdminAuthenticationService, UserRole } from '../../shared';

@Component({
    selector: 'app-left-nav',
    standalone: true,
    imports: [CommonModule, RouterModule, RouterLink],
    templateUrl: './left-nav.component.html',
})

export class LeftNavComponent implements OnInit {
    constructor(public router: Router, private apiService: ApiService, private adminAuthentication: AdminAuthenticationService, private spinner: SpinnerVisibilityService) {}
    openSurveyUrl: string = '/pulseSurvey/home/openSurveys';
    completedSurveyUrl: string = '/pulseSurvey/home/completedSurveys';
    isAdmin: boolean = true;

    ngOnInit():void {
        this.fetchEmployeeDetails();
    }
    
    private fetchEmployeeDetails():void {
        this.apiService.getEmployeeDetails().subscribe((data: any) => {
            this.spinner.hide();
            this.isAdmin = data.role === UserRole.Admin;
            this.isAdmin ? this.adminAuthentication.isAdmin() : this.adminAuthentication.isNotAdmin();
        });
    }
}