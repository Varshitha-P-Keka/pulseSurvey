import { Router } from '@angular/router';
import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormArray, FormsModule, Validators } from '@angular/forms';

import { Guid } from 'guid-typescript';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { BsDatepickerModule, BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { ApiService } from 'src/app/services/api.service';
import { SurveyData } from 'src/app/models/launchSurveyData.model';
import { SurveyQuestion } from 'src/app/models/launchSurveyQuestions.model';
import { ModalService } from 'src/app/services/modal-service.service';

enum ActiveStep {
    BasicFields = 1,
    SurveyQuestions = 2,
}

@Component({
    selector: 'app-launch-survey',
    standalone: true,
    imports: [CommonModule, BsDatepickerModule, ReactiveFormsModule, BsDropdownModule, AccordionModule, FormsModule],
    providers: [BsModalService, BsDatepickerConfig],
    templateUrl: './launch-survey.component.html',
})
export class LaunchSurveyComponent implements OnInit {
    showExisitingTemplates = false;
    showDescription: boolean = false;
    selectedItem: string = 'Select';
    activeStep: ActiveStep = ActiveStep.BasicFields;
    questionName: any;
    surveys: any;
    errorInpuFieldMsg: any;
    selectionErrorMsg: any;
    surveyNames: any;
    existingTemplateNames: any;
    templateId: any;
    exisitngTemplates: any;
    formResponses: any[] = [];
    optionIdCounter = 1;
    options: any[] = [];
    basicFieldsForm!: FormGroup;
    surveyQuestionsForm!: FormGroup;
    launchSurveyModalRef!: BsModalRef;
    fullModalRef!: BsModalRef;
    templateQuestions: any;
    @ViewChild('dropdown', { static: true }) dropdown!: BsDropdownDirective;
    @ViewChild('launchNewSurvey', { static: true })
    launchNewSurvey!: TemplateRef<any>;

    constructor(private router: Router, private bsModalService: BsModalService, private modalService: ModalService, private apiService: ApiService, private formBuilder: FormBuilder, private datePipe: DatePipe) {}

    ngOnInit(): void {
        this.basicFieldsForm = this.formBuilder.group({
            surveyId: [''],
            surveyName: ['', [Validators.required]],
            surveyDescription: ['', [Validators.required]],
            surveyExpiry: ['', [Validators.required]],
        });

        this.surveyQuestionsForm = this.formBuilder.group({
            surveyQuestionName: [''],
            surveyQuestionDescription: [''],
            radiobutton: [''],
            inputFields: this.formBuilder.array([]),
        });

        this.apiService.getactiveSurveys().subscribe((data) => {
            this.surveys = data;
            this.surveyNames = [];
            for (const survey of this.surveys) {
                this.surveyNames.push(survey.surveyTitle);
            }
        });

        this.modalService.launchNewSurvey$.subscribe((data) => {
            this.onLaunchSurveyClick();
        });
    }

    generateOptionFormControl(optionId: number, optionText: string) {
        return this.formBuilder.group({
            optionId: [optionId],
            optionText: [optionText],
        });
    }

    launchSurvey() {
        const surveyQuestionFormsArray = this.formResponses.map((response) => response.surveyQuestionForm.value);
        const customSurveyQuestionFormsArray = surveyQuestionFormsArray.map((formValue: any) => {
            const options = formValue.inputFields.map((option: any, index: number) => ({ optionId: index + 1, optionText: option }));
            let newsurveyQuestionId = Guid.create();
            let surveyQuestionId: string = Reflect.get(newsurveyQuestionId, 'value');
            return new SurveyQuestion(surveyQuestionId, formValue.surveyQuestionName, formValue.surveyQuestionDescription, formValue.radiobutton, options);
        });
        let createSurveyId = Guid.create();
        let surveyId: string = Reflect.get(createSurveyId, 'value');

        const surveyData = new SurveyData(surveyId, this.basicFieldsForm.value.surveyName, this.basicFieldsForm.value.surveyDescription, this.formatDate(new Date()), this.formatDate(this.basicFieldsForm.value.surveyExpiry), 1, customSurveyQuestionFormsArray);
        this.apiService.sendSurveyQuestions(surveyData);
        this.launchSurveyModalRef.hide();
        this.fullModalRef.hide();
        this.router.navigate(['/pulseSurvey/home/admin/surveys/active']);
    }

    validateField(field: string) {
        const control = this.basicFieldsForm.get(field);
        if (control) {
            control.markAsTouched();
        }
    }

    hide() {
        this.fullModalRef.hide();
        this.launchSurveyModalRef.hide();
        this.router.navigate(['/pulseSurvey/home/admin/surveys/active']);
    }

    addInputField(index: number) {
        const currentResponse = this.formResponses[index];
        const inputFields = currentResponse.surveyQuestionForm.get('inputFields') as FormArray;
        if (inputFields.length < 5) {
            inputFields.push(this.formBuilder.control(''));
            currentResponse.errorInpuFieldMsg = '';
            this.options.push({ optionId: this.optionIdCounter++, optionValue: '' });
        } else {
            currentResponse.errorInpuFieldMsg = 'Max 5 options';
        }
    }

    deleteAccordion(index: number) {
        this.formResponses.splice(index, 1);
    }

    removeInputField(index: number, responseIndex: number) {
        const currentResponse = this.formResponses[responseIndex];
        const inputFields = currentResponse.surveyQuestionForm.get('inputFields') as FormArray;
        inputFields.removeAt(index);
        currentResponse.errorInpuFieldMsg = '';
    }

    addDescription() {
        this.showDescription = true;
    }

    updateActiveStep(step: number) {
        this.activeStep = step;
    }

    updateQuestionName(event: Event, index: number) {
        const target = event.target as HTMLInputElement;
        this.formResponses[index].questionName = target.value;
    }

    addResponse() {
        this.formResponses.push({
            surveyQuestionForm: this.generateSurveyQuestionForm(),
        });
    }

    generateSurveyQuestionForm(): FormGroup {
        return this.formBuilder.group({
            surveyQuestionName: [''],
            surveyQuestionDescription: [''],
            radiobutton: [''],
            inputFields: this.formBuilder.array([]),
        });
    }

    toggleAdditionalItems() {
        this.showExisitingTemplates = !this.showExisitingTemplates;
    }

    openLaunchSurveyModal(fullTemplate: TemplateRef<any>) {
        if (this.selectedItem === 'select') {
            this.selectionErrorMsg = 'Select an option';
            return;
        } else {
            this.selectionErrorMsg = '';
            this.fullModalRef = this.bsModalService.show(fullTemplate, { class: 'full-modal' });
            const selectedTemplate = this.exisitngTemplates.find((template: { templateTitle: string }) => template.templateTitle === this.selectedItem);
            if (selectedTemplate) {
                this.basicFieldsForm.patchValue({
                    surveyName: selectedTemplate.templateTitle,
                    surveyDescription: this.getSurveyDescription(),
                });
            }
        }
    }

    hideModal(modalRef: BsModalRef) {
        modalRef.hide();
    }

    getSurveyDescription() {
        const selectedTemplate = this.exisitngTemplates.find((template: { templateTitle: string }) => template.templateTitle === this.selectedItem);
        return selectedTemplate ? selectedTemplate.templateDescription : '';
    }

    getTemplateIdByName(selectedItem: any) {
        for (let i = 0; i < this.exisitngTemplates.length; i++) {
            if (this.exisitngTemplates[i].templateTitle === selectedItem) {
                return this.exisitngTemplates[i].templateId;
            }
        }
        return null;
    }

    onItemSelect(item: string) {
        if (item === 'Create using existing template') {
            this.showExisitingTemplates = true;
            this.activeStep = 1;
        } else {
            this.showExisitingTemplates = false;
            this.selectedItem = item;
            this.activeStep = 1;
        }
    }

    onSave() {
        this.updateActiveStep(2);
        if (this.selectedItem != 'Create a new survey') {
            this.templateId = this.getTemplateIdByName(this.selectedItem);
            this.apiService.getTemplateQuestions(this.templateId).subscribe((templateQuestions: any) => {
                templateQuestions.forEach((question: any) => {
                    const newForm = this.generateSurveyQuestionForm();
                    newForm.patchValue({
                        surveyQuestionName: question.questionText,
                        surveyQuestionDescription: question.description,
                        radiobutton: question.questionType,
                    });

                    if (question.options && question.options.length) {
                        const inputFields = newForm.get('inputFields') as FormArray;
                        inputFields.clear();
                        question.options.forEach((option: any) => {
                            inputFields.push(this.formBuilder.control(option.optionText));
                        });
                    }
                    this.formResponses.push({
                        surveyQuestionForm: newForm,
                        questionName: question.questionText,
                    });
                });
            });
        }
    }

    formatDate(date: any) {
        let fdate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS');
        return fdate + 'Z';
    }

    toBasicFields() {
        this.updateActiveStep(1);
    }

    onAdditionalItemSelect(additionalItem: string) {
        this.selectedItem = additionalItem;
    }

    onLaunchSurveyClick() {
        this.launchSurveyModalRef = this.bsModalService.show(this.launchNewSurvey, { class: 'small-modal' });
        this.selectedItem = 'select';
        this.apiService.getTemplates().subscribe((data: any) => {
            this.exisitngTemplates = data;
            const templateTitles: string[] = data.map((item: any) => item.templateTitle);
            this.existingTemplateNames = templateTitles;
        });
    }
}
