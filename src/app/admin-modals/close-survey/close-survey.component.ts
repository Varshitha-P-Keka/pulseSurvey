import { Component, OnInit} from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ServicesService } from 'src/app/services/services.service';
import { RouterLink } from '@angular/router';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { BsDatepickerConfig, BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ReactiveFormsModule} from '@angular/forms';

@Component ({
  selector: 'app-close-survey',
  standalone: true,
  imports: [CommonModule, RouterLink, BsDatepickerModule, ReactiveFormsModule],
  providers: [BsModalService, BsDatepickerConfig],
  templateUrl: './close-survey.component.html'
})

export class CloseSurveyComponent implements OnInit {
  modalRef!: BsModalRef;
  survey: any;
  constructor(private service: ServicesService,private modalService: BsModalService,private ModalService: ModalServiceService,public bsModalRef:BsModalRef) {}

  ngOnInit(): void {
    this.ModalService.surveyUpdated$.subscribe((survey) => {
      this.survey = survey;
    });
  }

  hideModal() {
    this.bsModalRef.hide();
  }

  closeSurvey() {
    this.service.closeSurvey(this.survey.surveyId);
    this.hideModal();
  }
}