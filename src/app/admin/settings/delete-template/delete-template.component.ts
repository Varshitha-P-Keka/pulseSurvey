import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ServicesService } from 'src/app/services/services.service';
import { ModalServiceService } from 'src/app/services/modal-service.service';

@Component({
  selector: 'app-delete-template',
  standalone: true,
  imports: [CommonModule],
  providers: [BsModalService],
  templateUrl: './delete-template.component.html'
})

export class DeleteTemplateComponent {

  modalRef!: BsModalRef;
  constructor(
    private service: ServicesService,
    private modalService: BsModalService,
    private ModalService: ModalServiceService,
    public bsModalRef:BsModalRef
  ) {}

  deleteTemplate() {
    let templateToDelete = this.ModalService.getDeleteTemplate();
    console.log('template to dleete in deleete compo',templateToDelete.templateId);
    this.service.deleteTemplate(templateToDelete.templateId);
    this.hideModal();

  }

  hideModal (){
    this.bsModalRef.hide();
  }
}
