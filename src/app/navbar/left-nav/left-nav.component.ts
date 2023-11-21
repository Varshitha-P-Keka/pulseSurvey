import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule,RouterLink } from '@angular/router';

@Component({
    selector: 'app-left-nav',
    standalone: true,
    imports: [CommonModule, RouterModule,RouterLink],
    templateUrl: './left-nav.component.html',
})

export class LeftNavComponent{
    openSurveyUrl:string = '/pulseSurvey/home/openSurveys';
    completedSurveyUrl:string = '/pulseSurvey/home/completedSurveys';
    
    constructor(public router: Router) {}

}
