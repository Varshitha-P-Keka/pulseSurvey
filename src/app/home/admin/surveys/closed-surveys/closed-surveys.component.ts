import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Component, ViewChild, ElementRef } from '@angular/core';

import { NgSelectComponent, NgSelectModule } from '@ng-select/ng-select';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService, UserDataService, ModalService } from '../../../../shared';
import { RelaunchSurveyComponent } from './relaunch-survey/relaunch-survey.component';

@Component({
    selector: 'app-closed-surveys',
    standalone: true,
    imports: [CommonModule, NgSelectModule, FormsModule, BsDatepickerModule, RelaunchSurveyComponent],
    templateUrl: './closed-surveys.component.html',
})

export class ClosedSurveysComponent {
    @ViewChild('dateRangeCalendar') dateRangeCalendar!: ElementRef;
    @ViewChild('selectDropdown') selectDropdown!: NgSelectComponent;
    closedSurveys: any;
    bsModalRef!: BsModalRef;
    filteredSurveys: any;
    selectedFilterId: any ;
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

    constructor(private apiService: ApiService, public bsModalService: BsModalService, private router: Router, private behaviorSubjectService: UserDataService, private modalService: ModalService, private spinner: SpinnerVisibilityService) {}

    ngOnInit():void {
        this.apiService.surveyEdited$.subscribe((updated) => {
            if (updated) {
                this.showClosedSurveys();
            }
        });

        this.apiService.getClosedSurveys().subscribe({
            next: (data) => {
                this.spinner.hide();
                this.closedSurveys = data;
                this.filteredSurveys = data;
                this.combinedFilterArray = data;
            },
            error: (e) => {},
        });

        this.showClosedSurveys();
    }

    filterOnInput(event: any):void {
        this.inputTextFilter = event.value.trim();
        if (this.selectedFilterId == 4) this.combinedSelectFilter(this.selectedFilterId, this.filterStartDate, this.filterEndDate);
        else this.combinedSelectFilter(this.selectedFilterId);
    }

    filterDropDown(id: any) {
        this.selectedDate = null;
        if (id == 4) this.dateRangeCalendar.nativeElement.click();
        else {
            this.combinedSelectFilter(id);
        }
    }

    private combinedSelectFilter(id: number, setBeginDate?: any, setEndDate?: any) {
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
            this.filteredSurveys = this.closedSurveys.filter((survey: any) => {
                let launchedDate = new Date(survey.launchedOn);
                return launchedDate >= beginDate && launchedDate <= endDate;
            });
            this.combinedFilterArray = this.filteredSurveys;
            this.selectDropdown.clearModel();
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
        this.filteredSurveys = this.closedSurveys;
    }

    toggleDropdown(survey: any):void {
        survey.dropdownOpen = !survey.dropdownOpen;
        document.addEventListener('click', this.onClick.bind(this));
    }

    private onClick(event: Event):void {
        if (!this.isClickedInside(event)) {
            this.filteredSurveys.forEach((survey: any) => (survey.dropdownOpen = false));
        }
    }

    private isClickedInside(event: Event): boolean {
        return !!(event.target as HTMLElement).closest('.dropdown');
    }

    toReLaunchSurvey(survey: any):void {
        this.bsModalRef = this.bsModalService.show(RelaunchSurveyComponent, { class: 'small-modal' });
        this.modalService.setupdateSurvey(survey);
        survey.dropdownOpen = false;
    }

    showClosedSurveys():void {
        this.apiService.getClosedSurveys().subscribe({
            next: (data) => {
                this.spinner.hide();
                this.closedSurveys = data;
            },
            error: (e) => {},
        });
    }

    toViewSurvey(survey: any):void {
        this.behaviorSubjectService.setViewSurveyId(survey.surveyId);
        this.router.navigate(['pulseSurvey/home/admin/surveys/closed/view']);
    }
}