import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DatePipe } from '@angular/common';

import { loggeduser } from 'src/app/modals/modal';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { UserDataService } from 'src/app/services/user-data.service';


@Component({
  selector: 'app-top-nav',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './top-nav.component.html'
})
export class TopNavComponent {
  @Input() userDetails:loggeduser={name:'',emailaddress:'',employeeId:'',role:''};
  today:any;
  selectedFile:any
  selectedTheme:string = 'light-theme';

  constructor(private date:DatePipe,private ModalService:ModalServiceService, private udService: UserDataService){}

  ngOnInit() {
    this.userDetails=JSON.parse(<string>localStorage.getItem('currentUser'));
    this.today= this.date.transform(new Date(),'dd MMM YYYY');
    this.selectedFile = this.ModalService.getImage();
    
  }

  darkTheme(){
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
