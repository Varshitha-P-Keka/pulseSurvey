import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Guid } from 'guid-typescript';

import { ApiService } from 'src/app/services/api.service';
import { NewTemplateData } from '../../../models/newTemplateData.model';
import { TemplateQuestion } from 'src/app/models/templateQuestionsArray.model';

enum ActiveStep {
    basicFields = 1,
    surveyQuestions = 2,
}

@Component({
    selector: 'app-create-template',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AccordionModule],
    providers: [BsModalService, BsDatepickerConfig],
    templateUrl: './create-template.component.html',
})
export class CreateTemplateComponent implements OnInit {
    showAdditionalItems = false;
    showDescription: boolean = false;
    currentStep = ActiveStep;
    activeStep = this.currentStep.basicFields;
    questionName: any;
    maxInputFieldsErrorMsg: any;
    templateId: any;
    formResponses: any[] = [];
    options: any[] = [];
    optionIdCounter = 1;
    basicFieldsForm!: FormGroup;
    templateQuestionsForm!: FormGroup;
    templateQuestions: any;

    constructor(private apiService: ApiService, private formBuilder: FormBuilder, public bsModalRef: BsModalRef) {}

    ngOnInit(): void {
        this.basicFieldsForm = this.formBuilder.group({
            templateTitle: ['', Validators.required],
            templateDescription: ['', Validators.required],
        });

        this.templateQuestionsForm = this.formBuilder.group({
            surveyQuestionName: [''],
            surveyQuestionDescription: [''],
            radiobutton: [''],
            inputFields: this.formBuilder.array([]),
        });
    }

    updateActiveStep(step: number) {
        this.activeStep = step;
    }

    addTemplateQuestions() {
        const formattedDate = new Date().toISOString();
        let createTemplateQuestionId = Guid.create();
        let templateQuestionId: string = Reflect.get(createTemplateQuestionId, 'value');
        let createTemplateId = Guid.create();
        let templateId: string = Reflect.get(createTemplateId, 'value');
        const customtemplateQuestionFormsArray = this.formResponses.map(
            (response) =>
                new TemplateQuestion(
                    templateQuestionId,
                    response.templateQuestionForm.value.surveyQuestionName,
                    response.templateQuestionForm.value.surveyQuestionDescription,
                    response.templateQuestionForm.value.radiobutton,
                    response.templateQuestionForm.value.inputFields.map((option: any, index: any) => ({ optionId: index + 1, optionText: option }))
                )
        );
        const TemplateData = new NewTemplateData(templateId, this.basicFieldsForm.value.templateTitle, this.basicFieldsForm.value.templateDescription, formattedDate, formattedDate, customtemplateQuestionFormsArray);
        this.apiService.addNewTemplate(TemplateData);
        this.bsModalRef.hide();
    }
    addDescription() {
        this.showDescription = true;
    }

    addResponse() {
        this.formResponses.push({
            templateQuestionForm: this.generateSurveyQuestionForm(),
            questionName: '',
        });
    }

    removeInputField(index: number, responseIndex: number) {
        const currentResponse = this.formResponses[responseIndex];
        const inputFields = currentResponse.templateQuestionForm.get('inputFields') as FormArray;
        inputFields.removeAt(index);
        currentResponse.maxInputFieldsErrorMsg = '';
    }

    generateSurveyQuestionForm(): FormGroup {
        return this.formBuilder.group({
            surveyQuestionName: [''],
            surveyQuestionDescription: [''],
            radiobutton: [''],
            inputFields: this.formBuilder.array([]),
        });
    }

    addInputField(index: number) {
        const currentResponse = this.formResponses[index];
        const inputFields = currentResponse.templateQuestionForm.get('inputFields') as FormArray;
        if (inputFields.length < 5) {
            inputFields.push(this.formBuilder.control(''));
            this.options.push({ optionId: this.optionIdCounter++, optionValue: '' });
        }
        currentResponse.maxInputFieldsErrorMsg = inputFields.length < 5 ? '' : 'Max 5 options';
    }

    deleteAccordion(index: number) {
        this.formResponses.splice(index, 1);
    }

    hideModal() {
        this.bsModalRef.hide();
    }

    onSave() {
        this.updateActiveStep(this.currentStep.surveyQuestions);
    }
}
