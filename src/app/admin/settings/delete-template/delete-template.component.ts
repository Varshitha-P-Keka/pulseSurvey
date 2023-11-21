import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BsModalRef } from 'ngx-bootstrap/modal';

import { ApiService } from 'src/app/services/api.service';
import { ModalService } from 'src/app/services/modal-service.service';

@Component({
    selector: 'app-delete-template',
    standalone: true,
    imports: [CommonModule],
    templateUrl: './delete-template.component.html',
})
export class DeleteTemplateComponent {
    modalRef!: BsModalRef;

    constructor(private apiService: ApiService, private modalService: ModalService, public bsModalRef: BsModalRef) {}

    deleteTemplate() {
        let templateToDelete = this.modalService.getDeleteTemplate();
        this.apiService.deleteTemplate(templateToDelete.templateId);
        this.bsModalRef.hide();
    }
}
