import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { NgSelectModule } from '@ng-select/ng-select';
import { loggeduser } from 'src/app/modals/modal';
import { ServicesService } from 'src/app/services/services.service';

@Component({
    selector: 'app-completed-surveys',
    standalone: true,
    imports: [CommonModule,NgSelectModule],
    templateUrl: './completed-surveys.component.html',
    styleUrls: ['./completed-surveys.component.scss'],
})
export class CompletedSurveysComponent {
    userDetails: loggeduser = { name: '', emailaddress: '', employeeId: '', role: '' };
    completedSurveys: any;

    filterOptions=[
        {id:1,name:"past 7 days"},
        {id:1,name:"past 14 days"},
        {id:1,name:"past 21 days"},
        {id:1,name:"custom range"}
    ]

    constructor(private httpService: ServicesService) {}

    ngOnInit() {
        this.userDetails = JSON.parse(<string>localStorage.getItem('currentUser'));
        this.httpService.getCompletedSurveys(this.userDetails.employeeId).subscribe({
            next: (data) => {
                this.completedSurveys = data;
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

      filterPicked(val:string){
        console.log("Option changed",val);
        
      }
}
