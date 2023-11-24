import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormBuilder,FormsModule } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';

import { ApiService } from 'src/app/services/api.service';
import { ModalService } from 'src/app/services/modal-service.service';
import { LaunchSurveyFullModalComponent } from './launch-survey-full-modal/launch-survey-full-modal.component';

enum SelectedItem {
  existing = 'Create using existing template',
  new =  'Create a new survey',
  default = 'select'
}

@Component({
  selector: 'app-launch-survey',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,BsDropdownModule,FormsModule,LaunchSurveyFullModalComponent],
  providers: [BsModalService],
  templateUrl: './launch-survey.component.html',
})

export class LaunchSurveyComponent implements OnInit {
  showExisitingTemplates = false;
  selectedItem: SelectedItem = SelectedItem.default;
  SelectedItem = SelectedItem;
  selectionErrorMsg: string = '';
  existingTemplateNames: any[]=[];
  exisitngTemplates: any[]=[];
  ModalRef!: BsModalRef | undefined;

  constructor(public bsModalRef: BsModalRef,private bsModalService: BsModalService,private modalService: ModalService,private apiService: ApiService,private formBuilder: FormBuilder) {}

  ngOnInit(): void {
    this.onLaunchSurveyClick();
    this.modalService.hideModal$.subscribe(() => {
      this.hideModal();
    });
  }

  hideModal():void {
    this.bsModalRef.hide();
  }

  toggleTemplates():void {
    this.showExisitingTemplates = !this.showExisitingTemplates;
  }

  toLaunchSurveyFullModal(): void {
    this.bsModalService.show(LaunchSurveyFullModalComponent, { class: 'full-modal' });
    if (this.selectedItem === SelectedItem.default) {
      this.selectionErrorMsg = 'Please select a valid option';
      return;
    }
    this.selectionErrorMsg = '';
    this.modalService.setSelectedItem(this.selectedItem);
  }  

  onNewSurveySelect(item: any): void {
    this.showExisitingTemplates = item === SelectedItem.existing;
    this.selectedItem = item !== SelectedItem.existing ? item : '';
  }  

  onTemplateSelect(additionalItem: any):void {
    this.selectedItem = additionalItem;
  }

  onLaunchSurveyClick(): void {
    this.selectedItem = SelectedItem.new;
    this.apiService.getTemplates().subscribe((data: any) => {
      this.exisitngTemplates = data;
      this.existingTemplateNames = data.map((item: any) => item.templateTitle);
    });
  }  
}