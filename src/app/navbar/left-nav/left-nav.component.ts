import { Component,EventEmitter,Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Router } from '@angular/router';

import { loggeduser } from 'src/app/modals/modal';

@Component({
  selector: 'app-left-nav',
  standalone: true,
  imports: [CommonModule,RouterModule],
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent {

  @Output() navigateToProfile: EventEmitter<string>= new EventEmitter<string>();
  @Input() userDetails:loggeduser={name:'',emailaddress:'',employeeId:'',role:''};
  constructor(private router:Router){}


  ngOnInit(){
    this.userDetails=JSON.parse(<string>localStorage.getItem('currentUser'));
  }
  toMe() {
    this.navigateToProfile.emit("me");
  }
  toAdmin(){
    this.navigateToProfile.emit("admin");
  }
}
