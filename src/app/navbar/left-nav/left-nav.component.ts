import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { loggeduser } from 'src/app/modals/modal';

@Component({
  selector: 'app-left-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './left-nav.component.html',
  styleUrls: ['./left-nav.component.scss']
})
export class LeftNavComponent {
  @Input() userDetails:loggeduser={name:'',emailaddress:'',employeeId:'',role:''};

  ngOnInit(){
    this.userDetails=JSON.parse(<string>localStorage.getItem('currentUser'));
  }
}
