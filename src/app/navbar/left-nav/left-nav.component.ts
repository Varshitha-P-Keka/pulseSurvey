import { Component,Input,Output , EventEmitter} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { loggeduser } from 'src/app/modals/modal';

@Component({
  selector: 'app-left-nav',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './left-nav.component.html'
})

export class LeftNavComponent {
  @Input() userDetails:loggeduser={name:'',emailaddress:'',employeeId:'',role:''};
  @Output() showNavChange = new EventEmitter<boolean>();
  activeItem: any;

  constructor(private router:Router){}


  ngOnInit(){
    this.userDetails=JSON.parse(<string>localStorage.getItem('currentUser'));
    this.activeItem = 'me';
  }
  
  toMe() {
    this.showNavChange.emit(true);
    this.activeItem = 'me';
    this.router.navigate(['/pulseSurvey/home/openSurveys']);
  }

  toAdmin() {
    this.showNavChange.emit(false);
    this.activeItem = 'admin';
    this.router.navigate(['/pulseSurvey/home/Admin/surveys/active']);
  }
}