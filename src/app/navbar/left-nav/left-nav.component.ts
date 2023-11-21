import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { Component, Input, Output, EventEmitter } from '@angular/core';

import { Loggeduser } from 'src/app/modals/loggedUser';

@Component({
    selector: 'app-left-nav',
    standalone: true,
    imports: [CommonModule, RouterModule],
    templateUrl: './left-nav.component.html',
})
export class LeftNavComponent {
    activeItem: any;

    constructor(private router: Router) {}

    toMe() {
        this.activeItem = 'me';
        this.router.navigate(['/pulseSurvey/home/openSurveys']);
    }

    toAdmin() {
        this.activeItem = 'admin';
        this.router.navigate(['/pulseSurvey/home/admin/surveys/active']);
    }
}
