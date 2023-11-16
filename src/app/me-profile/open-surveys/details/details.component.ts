import { Component,Input } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ServicesService } from 'src/app/services/services.service';
import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html'
})

export class DetailsComponent {
  @Input() surveyId:number=0;
  surveyDetails:any|undefined;

  constructor(private service:ServicesService, private udService:UserDataService){}

  ngOnInit(){
    this.service.getSurveyDetailsById(this.surveyId).subscribe({
      next: (data)=>{
        this.surveyDetails= data ;
      },
      error: (e)=>{console.log(e)}
    })
  }
}
