import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService } from 'src/app/services/api.service';
import { ModalService } from 'src/app/services/modal-service.service';
import { DeleteTemplateComponent } from './delete-template/delete-template.component';
import { UpdateTemplateComponent } from './update-template/update-template.component';
import { CreateTemplateComponent } from './create-template/create-template.component';

@Component({
    selector: 'app-settings',
    standalone: true,
    imports: [CommonModule, RouterLink, RouterOutlet, UpdateTemplateComponent, CreateTemplateComponent, DeleteTemplateComponent],
    providers: [BsModalService],
    templateUrl: './settings.component.html',
})
export class SettingsComponent implements OnInit {
    templates: any;
    bsModalRef: BsModalRef | undefined;
    dropdownOpen!: boolean;

    constructor(private apiService: ApiService, private bsModalService: BsModalService, private modalService: ModalService) {}

    ngOnInit(): void {
        this.showTemplates();
        this.subscribeToTemplateEvents();
    }

    subscribeToTemplateEvents() {
        this.apiService.templateUpdated$.subscribe(() => this.showTemplates());
        this.apiService.templateDeleted$.subscribe(() => this.showTemplates());
        this.apiService.templateAdded$.subscribe(() => this.showTemplates());
    }

    toCreateNewTemplate() {
        this.bsModalRef = this.bsModalService.show(CreateTemplateComponent, { class: 'full-modal' });
    }

    toUpdateTemplate(template: any) {
        template.dropdownOpen = false;
        this.modalService.setupdateTemplate(template);
        this.bsModalRef = this.bsModalService.show(UpdateTemplateComponent, { class: 'full-modal' });
    }

    toDeleteTemplate(template: any) {
        template.dropdownOpen = false;
        this.modalService.setdeleteTemplate(template);
        this.bsModalRef = this.bsModalService.show(DeleteTemplateComponent, { class: 'small-modal' });
    }

    showTemplates() {
        this.apiService.getTemplates().subscribe((data: any) => {
            this.templates = data;
            for (const template of this.templates) {
                template.createdOn = new DatePipe('en-US').transform(template.createdOn, 'MMM dd, yyyy');
                template.updatedOn = new DatePipe('en-US').transform(template.updatedOn, 'MMM dd, yyyy');
            }
        });
    }

    toggleDropdown(template: any) {
        template.dropdownOpen = !template.dropdownOpen;
    }
}
