import { Component, OnInit } from '@angular/core';
import { CommonModule, DatePipe } from '@angular/common';
import { RouterLink, RouterOutlet } from '@angular/router';

import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService, ModalService } from '../../../shared';
import { DeleteTemplateComponent, UpdateTemplateComponent, CreateTemplateComponent } from '../settings';

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

    constructor(private apiService: ApiService, private bsModalService: BsModalService, private modalService: ModalService, private spinner: SpinnerVisibilityService) {}

    ngOnInit(): void {
        this.showTemplates();
        this.subscribeToTemplateEvents();
    }

    private subscribeToTemplateEvents():void {
        this.apiService.templateUpdated$.subscribe(() => this.showTemplates());
        this.apiService.templateDeleted$.subscribe(() => this.showTemplates());
        this.apiService.templateAdded$.subscribe(() => this.showTemplates());
    }

    toCreateNewTemplate():void {
        this.bsModalRef = this.bsModalService.show(CreateTemplateComponent, { class: 'full-modal' });
    }

    toUpdateTemplate(template: any):void {
        template.dropdownOpen = false;
        this.modalService.setupdateTemplate(template);
        this.bsModalRef = this.bsModalService.show(UpdateTemplateComponent, { class: 'full-modal' });
    }

    toDeleteTemplate(template: any):void {
        template.dropdownOpen = false;
        this.modalService.setdeleteTemplate(template);
        this.bsModalRef = this.bsModalService.show(DeleteTemplateComponent, { class: 'small-modal' });
    }

    private showTemplates():void {
        this.apiService.getTemplates().subscribe((data: any) => {
            this.spinner.hide();
            this.templates = data;
            for (const template of this.templates) {
                template.createdOn = new DatePipe('en-US').transform(template.createdOn, 'MMM dd, yyyy');
                template.updatedOn = new DatePipe('en-US').transform(template.updatedOn, 'MMM dd, yyyy');
            }
        });
    }

    toggleDropdown(template: any):void {
        template.dropdownOpen = !template.dropdownOpen;
        document.addEventListener('click', this.onClick.bind(this));
    }

    private onClick(event: Event):void {
        if (!this.isClickedInside(event)) {
            this.templates.forEach((template: any) => (template.dropdownOpen = false));
        }
    }

    private isClickedInside(event: Event): boolean {
        return !!(event.target as HTMLElement).closest('.dropdown');
    }
}