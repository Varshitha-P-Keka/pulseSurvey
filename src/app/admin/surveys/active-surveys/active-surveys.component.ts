import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import{ BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { ServicesService } from 'src/app/services/services.service';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
import { CloseSurveyComponent } from 'src/app/admin-modals/close-survey/close-survey.component';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { UpdateSurveyComponent } from 'src/app/admin-modals/update-survey/update-survey.component';

@Component({
  selector: 'app-active-surveys',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet,UpdateSurveyComponent,CloseSurveyComponent],
  providers: [BsModalService],
  templateUrl: './active-surveys.component.html',
  styleUrls: ['./active-surveys.component.scss']
})

export class ActiveSurveysComponent {
  activeSurveys:any = null;
  bsModalRef!: BsModalRef;
  surveys:any;
  expiresOn:any;
  launchedOn:any;
  formattedDate:any;
  formattedLaunchedOn:any;
  dropdownOpen!: boolean;

  constructor(private router:Router,private service:ServicesService,public modalService: BsModalService,private ModalService:ModalServiceService){}
  ngOnInit(): void {
    this.service.surveyUpdated$.subscribe((updated) => {
      if (updated) {
       this.showActiveSurveys();
      }
    });
    this.service.surveyEdited$.subscribe((updated) => {
      if (updated) {
       this.showActiveSurveys();
      }
    });
    this.service.surveyAdded$.subscribe((updated) => {
      if (updated) {
       this.showActiveSurveys();
      }
    });
    this.showActiveSurveys();
  }

  toggleDropdown(survey: any) {
    survey.dropdownOpen = !survey.dropdownOpen;
  }

  toClosedSurveys(survey:any) { 
    this.bsModalRef = this.modalService.show(CloseSurveyComponent, { class: 'small-modal' });
    this.ModalService.setupdateSurvey(survey);
    survey.dropdownOpen = false; 
  }

  toLaunchNewSurvey() {
    this.service.getactiveSurveys().subscribe((data) => {
      this.ModalService.triggerLaunchNewSurvey(this.activeSurveys);
    }); 
    this.router.navigate(['/pulseSurvey/home/Admin/surveys/active/LaunchNewSurvey']);
  }

  showActiveSurveys() {
    this.service.getactiveSurveys().subscribe((data) => {
      this.activeSurveys = data;
      this.surveys = this.activeSurveys;
      this.surveys.reverse();
      for (const survey of this.surveys) {
        survey.launchedOn = new DatePipe('en-US').transform(survey.launchedOn, 'MMM dd, yyyy');
        survey.expiresOn = new DatePipe('en-US').transform(survey.expiresOn, 'MMM dd, yyyy');        
      }
      this.service.getTemplates().subscribe((data)=> {
        this.ModalService.setTemplates(data);
      })
    });  
  }

  toUpdateSurvey(survey:any) {
    this.bsModalRef = this.modalService.show(UpdateSurveyComponent, { class: 'small-modal' });
    this.ModalService.setupdateSurvey(survey);
    survey.dropdownOpen = false; 
  }

  update(survey: any) {
    console.log('show update');
    survey.dropdownOpen = false; 
  }
}