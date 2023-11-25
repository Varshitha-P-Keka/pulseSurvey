import { DatePipe } from '@angular/common';
import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Router } from '@angular/router';

import { SpinnerVisibilityService } from 'ng-http-loader';

import { ModalService,ApiService,UserDataService, Theme } from '../../shared';

@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html',
})

export class TopNavComponent {
  constructor(private router: Router,private date:DatePipe,private modalService:ModalService,private apiService:ApiService,private behaviorSubjectService: UserDataService, private spinner: SpinnerVisibilityService){}
  today:string| null = '';
  userDetails:any
  selectedFile:any
  dropdownOpen: boolean = false;
  selectedTheme: Theme = Theme.Light;

  ngOnInit():void {
    this.fetchEmployeeDetails();
    this.loadUserDetails();
    this.today = this.date.transform(new Date(), 'dd MMM YYYY');
  }

  private fetchEmployeeDetails():void {
    this.apiService.getEmployeeDetails().subscribe((data: any) => {
      this.spinner.hide();
      this.userDetails = data;
      this.selectedFile = this.userDetails.profilePicture;
    });
  }

  private loadUserDetails():void {
    this.userDetails = JSON.parse(<string>localStorage.getItem('currentUser'));
  }

  toLogout():void {
    localStorage.removeItem('token');
    this.router.navigate(['/pulseSurvey/login']);
  }

  toggleDropdown():void {
    this.dropdownOpen = !this.dropdownOpen;
    document.addEventListener('click', this.onClick.bind(this));
  }

  private onClick(event: Event):void {
    if (!this.isClickedInside(event)) this.dropdownOpen = false;
  }

  private isClickedInside(event: Event): boolean {
    return !!((event.target as HTMLElement).closest('.dropdown'));
  }

  darkTheme(): void {
    this.selectedTheme = this.selectedTheme === Theme.Light ? Theme.Dark : Theme.Light;
    this.behaviorSubjectService.setTheme(this.selectedTheme);
  }
}