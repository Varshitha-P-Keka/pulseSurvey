import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { ServicesService } from 'src/app/services/services.service';
import { ModalServiceService } from 'src/app/services/modal-service.service';

@Component({
  selector: 'app-delete-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-template.component.html',
})

export class DeleteTemplateComponent {
  modalRef!: BsModalRef;
  constructor(private service: ServicesService,private ModalService: ModalServiceService,public bsModalRef:BsModalRef) {}

  deleteTemplate() {
    let templateToDelete = this.ModalService.getDeleteTemplate();
    this.service.deleteTemplate(templateToDelete.templateId);
    this.bsModalRef.hide();
  }
}