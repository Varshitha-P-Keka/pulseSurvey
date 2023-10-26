import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { LeftNavComponent } from '../navbar/left-nav/left-nav.component';
import { TopNavComponent } from '../navbar/top-nav/top-nav.component';
import { UserDataService } from '../services/user-data.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule,LeftNavComponent,TopNavComponent],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {
  userDetails:any;

  constructor(private udService:UserDataService){}

  ngOnInit(){
    this.udService.getCredentials().subscribe((next:any)=>{
      if(JSON.stringify(next)!='{}'){
        this.userDetails = next;
        localStorage.setItem('currentUser',JSON.stringify(this.userDetails));
      }
    })
  }
}
