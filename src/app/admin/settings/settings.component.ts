import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { DatePipe } from '@angular/common';
import{ BsModalRef, BsModalService} from 'ngx-bootstrap/modal';
import { ServicesService } from 'src/app/services/services.service';
import { RouterLink } from '@angular/router';
import { RouterOutlet } from '@angular/router';
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
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent implements OnInit {
  templates:any;
  bsModalRef: BsModalRef|undefined;
  dropdownOpen!: boolean;
  constructor(private router:Router,private service:ServicesService,private modalService: BsModalService,private ModalService:ModalServiceService){}
  ngOnInit(): void {
    this.showTemplates();
    this.service.templateUpdated$.subscribe((updated) => {
      if (updated) {
       this.showTemplates();
      }
    });

    this.service.templateAdded$.subscribe((updated) => {
      if (updated) {
       this.showTemplates();
      }
    });

    this.service.templateDeleted$.subscribe((updated) => {
      if (updated) {
       this.showTemplates();
      }
    });
  }

  toCreateNewTemplate() {
    this.bsModalRef = this.modalService.show(CreateTemplateComponent, { class: 'full-modal' });
  }

  toUpdateTemplate(template:any) {
    console.log(template);
    console.log('update template');
    template.dropdownOpen = false;
    this.ModalService.setupdateTemplate(template);
    this.bsModalRef = this.modalService.show(UpdateTemplateComponent, { class: 'full-modal' });
  }

  toDeleteTemplate(template:any) {
    console.log('delete template',template.templateId);
    template.dropdownOpen = false;
    console.log('delete template' , template);
    this.ModalService.setdeleteTemplate(template);
    this.bsModalRef = this.modalService.show(DeleteTemplateComponent, { class: 'small-modal' });

  }

  showTemplates() {
    this.service.getTemplates().subscribe((data:any)=> {
      console.log(data);
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
