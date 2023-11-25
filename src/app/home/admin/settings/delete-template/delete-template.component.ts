import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { ApiService, ModalService } from '../../../../shared';

@Component({
  selector: 'app-delete-template',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './delete-template.component.html',
})

export class DeleteTemplateComponent {
  modalRef!: BsModalRef;

  constructor(private apiService: ApiService,private modalService: ModalService,public bsModalRef: BsModalRef) {}

  deleteTemplate(): void {
    let templateToDelete = this.modalService.getDeleteTemplate();
    this.apiService.deleteTemplate(templateToDelete.templateId);
    this.bsModalRef.hide();
  }
}