import { Component } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { Router,RouterOutlet, RouterLink,RouterModule} from '@angular/router';

import{ BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import { ServicesService } from 'src/app/services/services.service';
import { CloseSurveyComponent } from 'src/app/admin-modals/close-survey/close-survey.component';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { UpdateSurveyComponent } from 'src/app/admin-modals/update-survey/update-survey.component';

@Component ({
  selector: 'app-active-surveys',
  standalone: true,
  imports: [CommonModule,RouterOutlet,UpdateSurveyComponent,CloseSurveyComponent,RouterModule],
  providers: [BsModalService],
  templateUrl: './active-surveys.component.html'
})

export class ActiveSurveysComponent {
  activeSurveys: any = null;
  bsModalRef!: BsModalRef;
  surveys: any;
  dropdownOpen: boolean = false;

  constructor(private router: Router,private service: ServicesService,public modalService: BsModalService,private ModalService: ModalServiceService) {}

  ngOnInit(): void {
    this.subscribeToSurveyEvents();
    this.showActiveSurveys();
  } 

  subscribeToSurveyEvents() {
    this.service.surveyUpdated$.subscribe(() => this.showActiveSurveys());
    this.service.surveyEdited$.subscribe(() => this.showActiveSurveys());
    this.service.surveyAdded$.subscribe(() => this.showActiveSurveys());
  }

  toggleDropdown(survey: any) {
    survey.dropdownOpen = !survey.dropdownOpen;
  }

  toClosedSurveys(survey: any) {
    this.bsModalRef = this.modalService.show(CloseSurveyComponent, { class: 'small-modal' });
    this.ModalService.setupdateSurvey(survey);
    survey.dropdownOpen = false;
  }

  toLaunchNewSurvey() {
    this.service.getactiveSurveys().subscribe((data) => {
      this.ModalService.triggerLaunchNewSurvey(data);
    });
  }

  showActiveSurveys() {
    this.service.getactiveSurveys().subscribe((data: any) => {
      if (Array.isArray(data)) {
        this.surveys = data.reverse().map((survey: any) => ({...survey,
          launchedOn: this.transformDate(survey.launchedOn),
          expiresOn: this.transformDate(survey.expiresOn)
        }));
      }
    });
  }  

  transformDate(date: any) {
    return new DatePipe('en-US').transform(date, 'MMM dd, yyyy');
  }

  toUpdateSurvey(survey: any) {
    this.bsModalRef = this.modalService.show(UpdateSurveyComponent, { class: 'small-modal' });
    this.ModalService.setupdateSurvey(survey);
    survey.dropdownOpen = false;
  }
}