import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';

import { NgSelectModule } from '@ng-select/ng-select';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

import { ApiService } from 'src/app/services/api.service';

@Component({
    selector: 'app-completed-surveys',
    standalone: true,
    imports: [CommonModule, NgSelectModule, FormsModule, BsDatepickerModule],
    templateUrl: './completed-surveys.component.html',
})
export class CompletedSurveysComponent {
    @ViewChild('dateRangeCalendar') dateRangCalendar!: ElementRef;
    userToken:any;
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

    constructor(private apiService: ApiService) {}

    ngOnInit() {
        this.apiService.getCompletedSurveys().subscribe({
            next: (data) => {
                this.completedSurveys = data;
                this.filteredSurveys = data;
                this.combinedFilterArray = data;
            },
            error: (e) => {
                console.log(e);
            },
        });
    }

    filterOnInput(event: any) {
        this.inputTextFilter = event.value.trim();
        if (this.selectedFilterId == 4) this.combinedSelectFilter(this.selectedFilterId, this.filterStartDate, this.filterEndDate);
        else this.combinedSelectFilter(this.selectedFilterId);
    }

    filterDropDown(id: number) {
        if (id == 4) {
            this.dateRangCalendar.nativeElement.click();
        } else this.combinedSelectFilter(id);
    }

    combinedSelectFilter(id: number, setBeginDate?: any, setEndDate?: any) {
        this.selectedFilterId = id;
        console.log('Fliter Text', this.inputTextFilter);
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
    }

    onDateChange(dateRange: any) {
        this.filterStartDate = dateRange[0];
        this.filterEndDate = dateRange[1];
        this.combinedSelectFilter(4, dateRange[0], dateRange[1]);
    }

    reset() {
        this.selectedFilterId = null;
        this.inputTextFilter = '';
        this.selectedDate = null;
        this.filteredSurveys = this.completedSurveys;
    }
}
