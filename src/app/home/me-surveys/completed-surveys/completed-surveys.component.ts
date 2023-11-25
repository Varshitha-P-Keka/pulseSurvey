import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';

import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';

import { ApiService } from '../../../shared';

@Component({
    selector: 'app-completed-surveys',
    standalone: true,
    imports: [CommonModule, NgSelectModule, FormsModule, BsDatepickerModule],
    templateUrl: './completed-surveys.component.html',
})

export class CompletedSurveysComponent {
    @ViewChild('dateRangeCalendar') dateRangCalendar!: ElementRef;
    @ViewChild('selectDropdown') selectDropdown!: NgSelectComponent;
    userToken:string = '';
    completedSurveys: any;
    filteredSurveys: any;
    selectedFilterId: any;
    inputTextFilter: string = '';
    selectedDate: any;
    combinedFilterArray: any;
    filterStartDate: any;
    filterEndDate: any;

    filterOptions = [
        { id: 1, name: 'past 7 days' },
        { id: 2, name: 'past 14 days' },
        { id: 3, name: 'past 21 days' },
        { id: 4, name: 'custom range' },
    ];

    constructor(private apiService: ApiService, private spinner: SpinnerVisibilityService) {}

    ngOnInit():void {
        this.apiService.getCompletedSurveys().subscribe({
            next: (data) => {
                this.spinner.hide();
                this.completedSurveys = data;
                this.filteredSurveys = data;
                this.combinedFilterArray = data;
            },
            error: (e) => {},
        });
    }

    filterOnInput(event: any):void {
        this.inputTextFilter = event.value.trim();
        if (this.selectedFilterId == 4) this.combinedSelectFilter(this.selectedFilterId, this.filterStartDate, this.filterEndDate);
        else this.combinedSelectFilter(this.selectedFilterId);
    }

    filterDropDown(id: number):void {
        if (id == 4) this.dateRangCalendar.nativeElement.click();
         else this.combinedSelectFilter(id);
    }

    combinedSelectFilter(id: number, setBeginDate?: any, setEndDate?: any):void {
        this.selectedFilterId = id;
        let today = new Date();
        let beginDate = new Date(today);
        let endDate = new Date(today);
        if (id == 4) {
            beginDate = new Date(setBeginDate);
            endDate = new Date(setEndDate);
        } else {
            beginDate.setDate(today.getDate() - 7 * id);
            endDate.setDate(today.getDate());
        }
        if (this.selectedFilterId) {
            this.filteredSurveys = this.completedSurveys.filter((survey: any) => {
                let launchedDate = new Date(survey.launchedOn);
                return launchedDate >= beginDate && launchedDate <= endDate;
            });
            this.combinedFilterArray = this.filteredSurveys;
        }
        this.filteredSurveys = this.combinedFilterArray.filter((survey: any) => {
            return survey.surveyTitle.toLowerCase().includes(this.inputTextFilter.toLowerCase());
        });
        if(id){
            let selectedPlaceHolder = this.filterOptions.find((obj)=> obj.id == id)
           this.selectDropdown.placeholder = selectedPlaceHolder!.name;
        }
    }

    onDateChange(dateRange: any):void {
        this.filterStartDate = dateRange[0];
        this.filterEndDate = dateRange[1];
        this.combinedSelectFilter(4, dateRange[0], dateRange[1]);
    }

    reset():void {
        this.combinedSelectFilter(0);
        this.selectedFilterId = null;
        this.inputTextFilter = '';
        this.selectedDate = null;
        this.selectDropdown.placeholder ="Launched Between";
        this.filteredSurveys = this.completedSurveys;
    }
}