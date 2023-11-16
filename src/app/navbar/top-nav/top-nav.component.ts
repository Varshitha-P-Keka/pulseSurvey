import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { loggeduser } from 'src/app/modals/modal';


@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html'
})
export class TopNavComponent {
  @Input() userDetails:loggeduser={name:'',emailaddress:'',employeeId:'',role:''};
  today:any;

  constructor(private date:DatePipe){}

  ngOnInit(){
    this.userDetails=JSON.parse(<string>localStorage.getItem('currentUser'));
    this.today= this.date.transform(new Date(),'dd MMM YYYY');
  }
}
