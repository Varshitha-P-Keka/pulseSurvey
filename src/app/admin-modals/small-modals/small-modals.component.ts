import { Component, TemplateRef, OnInit, ViewChild } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ReactiveFormsModule } from '@angular/forms';
import { FormBuilder, FormGroup } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { ServicesService } from 'src/app/services/services.service';
import { RouterLink } from '@angular/router';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-small-modals',
  standalone: true,
  imports: [CommonModule, RouterLink, BsDatepickerModule, ReactiveFormsModule],
  providers: [BsModalService, BsDatepickerConfig],
  templateUrl: './small-modals.component.html',
  styleUrls: ['./small-modals.component.scss'],
})
export class SmallModalsComponent implements OnInit {
  updateSurveyForm!: FormGroup;
  bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
  };
  setFormData(data: any) {
    console.log(this.datePipe.transform(data.expiresOn, 'MM/dd/yyyy'));
    const surveyData = {
      surveyId: data.surveyId,
      surveyName: data.surveyTitle,
      surveyDescription: data.surveyDescription,
      surveyExpiry: this.datePipe.transform(data.expiresOn, 'MM/dd/yyyy'),
    };
    console.log(surveyData);
    this.updateSurveyForm.patchValue(surveyData);
  }
  survey: any;
  @ViewChild('CloseSurveyTemplate', { static: true })
  CloseSurveyTemplate!: TemplateRef<any>;
  @ViewChild('updateSurveyTemplate', { static: true })
  updateSurveyTemplate!: TemplateRef<any>;
  ngOnInit(): void {
    this.updateSurveyForm = this.fb.group({
      surveyId: [''],
      surveyName: [''],
      surveyDescription: [''],
      surveyExpiry: [''],
    });
    this.ModalService.openSmallModal$.subscribe((data: any) => {
      if (data && data.type === 'closeSurvey') {
        this.openCloseSurveyModal(data.survey);
      } else if (data && data.type === 'updateSurvey') {
        console.log(data.type);
        this.openUpdateSurveyModal(data.survey);
      }
    });
  }

  constructor(
    private router: Router,
    private service: ServicesService,
    private modalService: BsModalService,
    private ModalService: ModalServiceService,
    private fb: FormBuilder,
    private datePipe: DatePipe
  ) {
    this.bsConfig = Object.assign({}, { containerClass: 'theme-default' });
    this.bsConfig = {
      showWeekNumbers: false,
    };
  }
  modalRef!: BsModalRef;
  openCloseSurveyModal(data: any) {
    this.survey = data;
    this.modalRef = this.modalService.show(this.CloseSurveyTemplate, {
      class: 'small-modal',
    });
  }

  onSubmit() {
    let updatedSurveyData = {
      surveyId: this.updateSurveyForm.value.surveyId,
      surveyTitle: this.updateSurveyForm.value.surveyName,
      surveyDescription: this.updateSurveyForm.value.surveyDescription,
      expiresOn: this.formatDate(this.updateSurveyForm.value.surveyExpiry),
    };
    this.service.updateSurvey(updatedSurveyData);
  }

  formatDate(date: any) {
    let fdate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS');
    return fdate + 'Z';
  }
  openUpdateSurveyModal(data: any) {
    this.survey = data;
    this.modalRef = this.modalService.show(this.updateSurveyTemplate, {
      class: 'small-modal',
    });
    this.setFormData(data);
  }

  hideModal() {
    this.modalRef.hide();
  }

  closeSurvey() {
    this.service.closeSurvey(this.survey.surveyId);
    this.hideModal();
  }

  updateSurvey() {
    this.hideModal();
  }
}
