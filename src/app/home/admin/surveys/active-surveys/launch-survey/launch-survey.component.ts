import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ReactiveFormsModule,FormsModule } from '@angular/forms';

import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService, ModalService,SelectedItem } from '../../../../../shared';
import { LaunchSurveyFullModalComponent } from './launch-survey-full-modal';

@Component({
  selector: 'app-launch-survey',
  standalone: true,
  imports: [CommonModule,ReactiveFormsModule,BsDropdownModule,FormsModule,LaunchSurveyFullModalComponent],
  providers: [BsModalService],
  templateUrl: './launch-survey.component.html',
})

export class LaunchSurveyComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef,private bsModalService: BsModalService,private modalService: ModalService,private apiService: ApiService, private spinner: SpinnerVisibilityService) {}
  showExisitingTemplates:boolean = false;
  selectedItem: SelectedItem = SelectedItem.Default;
  SelectedItem = SelectedItem;
  selectionErrorMsg: string = '';
  existingTemplateNames: any[]=[];
  exisitngTemplates: any[]=[];
  ModalRef!: BsModalRef | undefined;

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
    if (this.selectedItem === SelectedItem.Default) {
      this.selectionErrorMsg = 'Please select a valid option';
      return;
    }
    this.selectionErrorMsg = '';
    this.modalService.setSelectedItem(this.selectedItem);
  }  

  onNewSurveySelect(item: any): void {
    this.showExisitingTemplates = item === SelectedItem.Existing;
    this.selectedItem = item !== SelectedItem.Existing ? item : '';
  }  

  onTemplateSelect(additionalItem: any):void {
    this.selectedItem = additionalItem;
  }

  onLaunchSurveyClick(): void {
    this.selectedItem = SelectedItem.New;
    this.apiService.getTemplates().subscribe((data: any) => {
      this.spinner.hide();
      this.exisitngTemplates = data;
      this.existingTemplateNames = data.map((item: any) => item.templateTitle);
    });
  }  
}