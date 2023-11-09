import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ServicesService } from 'src/app/services/services.service';
import { ActiveSurveysComponent } from 'src/app/admin/surveys/active-surveys/active-surveys.component';
import { RouterLink } from '@angular/router';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { BehaviorSubject } from 'rxjs';

@Component ({
  selector: 'app-update-survey',
  standalone: true,
  imports: [CommonModule, RouterLink, BsDatepickerModule, ReactiveFormsModule,ActiveSurveysComponent,FormsModule],
  providers: [BsModalService, BsDatepickerConfig],
  templateUrl: './update-survey.component.html',
  styleUrls: ['./update-survey.component.scss']
})

export class UpdateSurveyComponent implements OnInit {
  surveyToUpdate:any;
  activeSurveysComponent: any;
  updateSurveyForm!: FormGroup;
  date:any
  private surveyUpdatedSource = new BehaviorSubject<any>(null);
  surveyUpdated$ = this.surveyUpdatedSource.asObservable();

  ngOnInit(): void {
    this.updateSurveyForm = this.fb.group({
      surveyName: [''],
      surveyDescription: [''],
      surveyExpiry: [''],
    });

    this.ModalService.surveyUpdated$.subscribe((survey) => {
      this.surveyToUpdate = survey;
      if (this.surveyToUpdate) {
        this.updateSurveyForm.patchValue({
          surveyName: this.surveyToUpdate.surveyTitle,
          surveyDescription: this.surveyToUpdate.surveyDescription,
          surveyExpiry: this.datePipe.transform(this.surveyToUpdate.expiresOn, 'MM/dd/yyyy'),
        });
      }
    });
  }

  bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
  };

  ModalRef!: BsModalRef | undefined;
  survey:any;

  constructor(
    private router: Router,
    private service: ServicesService,
    public modalService: BsModalService,
    private ModalService: ModalServiceService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public bsModalRef:BsModalRef

  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-default' });
    this.bsConfig = {
      showWeekNumbers: false,
    };
  }

  onSubmit() {
    let updatedSurveyData = {
      surveyId: this.surveyToUpdate.surveyId,
      surveyTitle: this.updateSurveyForm.value.surveyName,
      surveyDescription: this.updateSurveyForm.value.surveyDescription,
      expiresOn: this.formatDate(this.updateSurveyForm.value.surveyExpiry),
    };
    this.service.updateSurvey(updatedSurveyData);
    this.hideModal();
  }

  formatDate(date: any) {
    let fdate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS');
    return fdate + 'Z';
  }

  hideModal() {
    this.bsModalRef.hide();
  }
} 