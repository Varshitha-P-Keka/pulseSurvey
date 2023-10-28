import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { TemplateRef } from '@angular/core';
import { BsModalRef,BsModalService, runInInjectionContext} from 'ngx-bootstrap/modal';
import { ViewChild } from '@angular/core';


@Component({
  selector: 'app-me',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './me.component.html',
  styleUrls: ['./me.component.scss']
})
export class MeComponent {
  modalService: BsModalService;
  modalRef: BsModalRef<any> = new BsModalRef();
  @ViewChild('fullTemplate', { static: true }) fullTemplate!: TemplateRef<any>;

  constructor(private router:Router,modalService: BsModalService){
    this.modalService = modalService;
  }
  showOpenSurveys: boolean = true;
    showCompletedSurveys: boolean = false;
    surveys: any[] = [
      {
        column1: ["Survey Name", "Survey details"],
        column2: ["Survey date", "Expiration"],
        column3: ["launch date", "Person Launched"]
      }
    ];
    

    toOpenSurveys() {
      this.router.navigate(['/pulseSurvey/home/Me/openSurveys']);
      this.showOpenSurveys = true;
      this.showCompletedSurveys = false;
    }

    openFullModal() {
      runInInjectionContext(() => {
        this.modalRef = this.modalService.show(this.fullTemplate, { class: 'full-modal' });
      });
    }
  
    toCompletedSurveys() {
      this.showOpenSurveys = false;
      this.showCompletedSurveys = true;
      this.router.navigate(['/pulseSurvey/home/Me/completedSurveys']);
    }
}