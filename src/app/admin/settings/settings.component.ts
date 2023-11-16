import { Component, OnInit } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { Router,RouterLink,RouterOutlet } from '@angular/router';

import{ BsModalRef, BsModalService} from 'ngx-bootstrap/modal';

import { ServicesService } from 'src/app/services/services.service';
import { DeleteTemplateComponent } from './delete-template/delete-template.component';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { UpdateTemplateComponent } from './update-template/update-template.component';
import { CreateTemplateComponent } from './create-template/create-template.component';

@Component ({
  selector: 'app-settings',
  standalone: true,
  imports: [CommonModule,RouterLink,RouterOutlet,UpdateTemplateComponent,CreateTemplateComponent,DeleteTemplateComponent],
  providers: [BsModalService],
  templateUrl: './settings.component.html',
})

export class SettingsComponent implements OnInit {
  templates:any;
  bsModalRef: BsModalRef|undefined;
  dropdownOpen!: boolean;
  constructor(private router:Router,private service:ServicesService,private modalService: BsModalService,private ModalService:ModalServiceService){}
  
  ngOnInit(): void {
    this.showTemplates();
    this.subscribeToTemplateEvents();    
  }

  subscribeToTemplateEvents() {
    this.service.templateUpdated$.subscribe(() => this.showTemplates());
    this.service.templateDeleted$.subscribe(() => this.showTemplates());
    this.service.templateAdded$.subscribe(() => this.showTemplates());
  }

  toCreateNewTemplate() {
    this.bsModalRef = this.modalService.show(CreateTemplateComponent, { class: 'full-modal' });
  }

  toUpdateTemplate(template:any) {
    template.dropdownOpen = false;
    this.ModalService.setupdateTemplate(template);
    this.bsModalRef = this.modalService.show(UpdateTemplateComponent, { class: 'full-modal' });
  }

  toDeleteTemplate(template:any) {
    template.dropdownOpen = false;
    this.ModalService.setdeleteTemplate(template);
    this.bsModalRef = this.modalService.show(DeleteTemplateComponent, { class: 'small-modal' });
  }

  showTemplates() {
    this.service.getTemplates().subscribe((data:any)=> {
      this.templates =data;
      for (const template of this.templates) {
        template.createdOn = new DatePipe('en-US').transform(template.createdOn, 'MMM dd, yyyy');
        template.updatedOn = new DatePipe('en-US').transform(template.updatedOn, 'MMM dd, yyyy');        
      }
    })
  }

  toggleDropdown(template:any) {
    template.dropdownOpen = !template.dropdownOpen;
  }
}