import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { ApiService } from 'src/app/services/api.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
    selector: 'app-top-nav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './top-nav.component.html',
})
export class TopNavComponent {
    today: any;
    userDetails: any;
    selectedFile: any;
    selectedTheme: string = 'light-theme';

    constructor(private datePipe: DatePipe, private apiService: ApiService, private behaviorSubjectService: UserDataService) {}

    ngOnInit() {
        this.apiService.getEmployeeDetails().subscribe((data: any) => {
            console.log(data);
            this.userDetails = data;
        });
        this.userDetails = JSON.parse(<string>localStorage.getItem('currentUser'));
        this.today = this.datePipe.transform(new Date(), 'dd MMM YYYY');
        this.selectedFile = this.userDetails.profilePicture;
        console.log(this.selectedFile);
    }

    darkTheme() {
        if (this.selectedTheme == 'light-theme') {
            this.selectedTheme = 'dark-theme';
            this.behaviorSubjectService.setTheme('dark-theme');
        } else {
            this.selectedTheme = 'light-theme';
            this.behaviorSubjectService.setTheme('light-theme');
        }
    }
}
