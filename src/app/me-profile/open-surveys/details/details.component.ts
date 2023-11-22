import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-details',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './details.component.html',
})
export class DetailsComponent {
    @Input() surveyId: number = 0;
    surveyDetails: any | undefined;

    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.apiService.getSurveyDetailsById(this.surveyId).subscribe({
            next: (data) => {
                this.surveyDetails = data;
            },
            error: (e) => {},
        });
    }
}
