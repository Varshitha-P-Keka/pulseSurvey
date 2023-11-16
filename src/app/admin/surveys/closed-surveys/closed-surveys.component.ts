import { Component, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { UserDataService } from 'src/app/services/user-data.service';
import { NgSelectModule } from '@ng-select/ng-select';
import { ServicesService } from 'src/app/services/services.service';

@Component({
  selector: 'app-closed-surveys',
  standalone: true,
  imports: [CommonModule,NgSelectModule,FormsModule,BsDatepickerModule],
  templateUrl: './closed-surveys.component.html',
  styleUrls: ['./closed-surveys.component.scss']
})

export class ClosedSurveysComponent {

  @ViewChild('dateRangeCalendar') dateRangCalendar!: ElementRef;
  closedSurveys:any;
  filteredSurveys: any;
  selectedFilterId: any;
  inputTextFilter: string = '';
  selectedDate: any;
  combinedFilterArray: any;
  filterStartDate: any;
  filterEndDate:any;

  filterOptions = [
      { id: 1, name: 'past 7 days' },
      { id: 2, name: 'past 14 days' },
      { id: 3, name: 'past 21 days' },
      { id: 4, name: 'custom range' },
  ];

  constructor(private httpService:ServicesService, private router: Router,private behaviorSubjectService:UserDataService){}

  ngOnInit(){
    this.httpService.getClosedSurveys().subscribe({
      next:(data)=>{
        this.closedSurveys = data;
        console.log(data);
        this.filteredSurveys = data;
        this.combinedFilterArray = data;
      },
      error:(e)=>{
        console.log(e);
      }
    })
  }

  // Development
  filterOnInput(event: any) {
    this.inputTextFilter = event.value.trim();
    if(this.selectedFilterId == 4)
        this.combinedSelectFilter(this.selectedFilterId,this.filterStartDate,this.filterEndDate);
    else
        this.combinedSelectFilter(this.selectedFilterId);
}

filterDropDown(id: number) {
    if(id==4){
        this.dateRangCalendar.nativeElement.click();
    }
    else
        this.combinedSelectFilter(id);
}

combinedSelectFilter(id: number, setBeginDate?: any, setEndDate?: any){
    this.selectedFilterId = id;
    console.log('Fliter Text', this.inputTextFilter);
    let today = new Date();
    let beginDate = new Date(today);
    let endDate = new Date(today);
    if (id == 4) {
        beginDate = new Date(setBeginDate);
        endDate = new Date(setEndDate);
    }
    else{
        beginDate.setDate(today.getDate() - 7 * id);
        endDate.setDate(today.getDate());
    }
    if(this.selectedFilterId){
        this.filteredSurveys = this.closedSurveys.filter((survey: any) => {
            let launchedDate = new Date(survey.launchedOn);
                return launchedDate >= beginDate && launchedDate <= endDate;
            });
        this.combinedFilterArray = this.filteredSurveys;
    }
        this.filteredSurveys = this.combinedFilterArray.filter((survey: any) => {
            return survey.surveyTitle.toLowerCase().includes(this.inputTextFilter.toLowerCase());
        });
}

onDateChange(dateRange: any) {
    this.filterStartDate = dateRange[0];
    this.filterEndDate = dateRange[1];
    this.combinedSelectFilter(4, dateRange[0], dateRange[1]);
}

reset(){
    this.selectedFilterId = null;
    this.inputTextFilter = '';
    this.selectedDate = null;
    this.filteredSurveys = this.closedSurveys;
}
  // Development

  // filterPicked(val:string){
  //   console.log("Option changed",val);
  // }

  toggleDropdown(survey: any) {
    survey.dropdownOpen = !survey.dropdownOpen;
  }

  reLaunchSurvey(survey:any){
    console.log("Re launch survey",survey);
  }

  viewSurvey(survey:any){
    this.behaviorSubjectService.setViewSurveyId(survey.surveyId);
    this.router.navigate(['pulseSurvey/home/Admin/surveys/closed/view']);
    console.log("View Survey",survey);
  }

}
