import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { SpinnerVisibilityService } from 'ng-http-loader';

import { ApiService } from '../../../../../shared';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './details.component.html',
})

export class DetailsComponent {
    constructor(private apiService: ApiService, private spinner: SpinnerVisibilityService) {}
    
    @Input() surveyId: number = 0;
    surveyDetails: any | undefined;

    ngOnInit():void {
        this.apiService.getSurveyDetailsById(this.surveyId).subscribe({
            next: (data) => {
                this.spinner.hide();
                this.surveyDetails = data;
            },
            error: (e) => {},
        });
    }
}