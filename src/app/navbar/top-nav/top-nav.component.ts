import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';

import { Router } from '@angular/router';

// import { loggeduser } from 'src/app/modals/modal';
import { ServicesService } from 'src/app/services/services.service';
import { ModalService } from 'src/app/services/modal-service.service';
import { ApiService } from 'src/app/services/api.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
    selector: 'app-top-nav',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './top-nav.component.html',
})
export class TopNavComponent {
  today:any;
  userDetails:any
  selectedFile:any
  dropdownOpen: boolean = false;
  selectedTheme:string = 'light-theme';

  constructor(private router: Router,private date:DatePipe,private modalService:ModalService,private apiService:ApiService,private behaviorSubjectService: UserDataService){}

  ngOnInit() {
    this.apiService.getEmployeeDetails().subscribe((data:any)=>{
      console.log(data);
      this.userDetails = data;

    });
    this.userDetails=JSON.parse(<string>localStorage.getItem('currentUser'));
    this.today= this.date.transform(new Date(),'dd MMM YYYY');
    this.selectedFile = this.userDetails.profilePicture;
    console.log(this.selectedFile);
    
  }

  toLogout() {
    localStorage.removeItem('token');
    this.router.navigate(['/pulseSurvey/login']);
  }

  toggleDropdown() {
    this.dropdownOpen = !this.dropdownOpen;
    document.addEventListener('click', this.onClick.bind(this));
  }

  onClick(event: Event) {
    if (!this.isClickedInside(event)) {
      this.dropdownOpen = false;
    }
  }

  isClickedInside(event: Event): boolean {
    return !!((event.target as HTMLElement).closest('.dropdown'));
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
