import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { UserDataService } from 'src/app/services/user-data.service';

@Component({
  selector: 'app-small-modal-survey-confirmation',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './small-modal-survey-confirmation.component.html'
})
export class SmallModalSurveyConfirmationComponent {

    constructor(public modalRef: BsModalRef, private behaviorSubjectService: UserDataService){}

    submitSurevyQuestions(){
      this.behaviorSubjectService.setSurveyQuestionsConfirmation(true);
      this.modalRef.hide();
    }
}
