import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { loggeduser } from 'src/app/modals/modal';
import { ServicesService } from 'src/app/services/services.service';
import { ModalServiceService } from 'src/app/services/modal-service.service';


@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html'
})
export class TopNavComponent {
  // @Input() userDetails:loggeduser={name:'',emailaddress:'',employeeId:'',role:'',profilePicture: ''};
  today:any;
  userDetails:any
  selectedFile:any

  constructor(private date:DatePipe,private ModalService:ModalServiceService,private service:ServicesService){}

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
}
