import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { Router } from '@angular/router';

import { loggeduser } from 'src/app/modals/modal';
import { ServicesService } from 'src/app/services/services.service';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { UserDataService } from 'src/app/services/user-data.service';


@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html'
})
export class TopNavComponent {
  today:any;
  userDetails:any
  selectedFile:any
  dropdownOpen: boolean = false;
  selectedTheme:string = 'light-theme';

  constructor(private router: Router,private date:DatePipe,private ModalService:ModalServiceService,private service:ServicesService,private udService: UserDataService){}

  ngOnInit() {
    this.service.getEmployeeDetails().subscribe((data:any)=>{
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
    if(this.selectedTheme=='light-theme'){
      this.selectedTheme = 'dark-theme';
      this.udService.setTheme('dark-theme');
    }
    else{
      this.selectedTheme = 'light-theme';
      this.udService.setTheme('light-theme');
    }
  }
}
