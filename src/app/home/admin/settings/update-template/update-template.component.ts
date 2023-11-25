import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';

import { Guid } from 'guid-typescript';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';

import { ApiService, ModalService, TemplateData, Option, ActiveStep, updateTemplateQuestion } from '../../../../shared';

@Component({
    selector: 'app-update-template',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AccordionModule],
    providers: [BsModalService, BsDatepickerConfig],
    templateUrl: './update-template.component.html',
})

export class UpdateTemplateComponent {
    showDescription: boolean = false;
    currentStep = ActiveStep;
    activeStep = this.currentStep.BasicFields;
    questionName: string = '';
    maxInputFieldsErrorMsg:  string = '';
    formResponses: any[] = [];
    options: any[] = [];
    basicFieldsForm!: FormGroup;
    templateQuestionsForm!: FormGroup;
    templateToUpdate: any;
    optionIdCounter: number = 0;

    constructor(private apiService: ApiService, private modalService: ModalService, private formBuilder: FormBuilder, public bsModalRef: BsModalRef, private spinner: SpinnerVisibilityService) {}

    ngOnInit(): void {
        this.initializeBasicFieldsForm();
        this.initializeTemplateQuestionsForm();
    }

    private initializeBasicFieldsForm(): void {
        this.templateToUpdate = this.modalService.getUpdateTemplate();
        this.basicFieldsForm = this.formBuilder.group({
            templateId: this.templateToUpdate.templateId,
            templateTitle: this.templateToUpdate.templateTitle,
            templateDescription: this.templateToUpdate.templateDescription,
        });
    }

    updateTemplate():void {
        const templateQuestionFormsArray = this.formResponses.map((response) => response.templateQuestionForm.value);
        const templateId = this.modalService.getUpdateTemplate().templateId;
        let createTemplateQuestionId = Guid.create();
        let templateQuestionId: string = Reflect.get(createTemplateQuestionId, 'value');
        const customtemplateQuestionFormsArray = templateQuestionFormsArray.map(
            (formValue) =>
                new updateTemplateQuestion(
                    templateQuestionId,
                    templateId,
                    formValue.surveyQuestionName,
                    formValue.surveyQuestionDescription,
                    formValue.radiobutton,
                    formValue.options.map((option:any, index: number) => new Option(index + 1, option))
                )
        );
        const templateData = new TemplateData(this.basicFieldsForm.value.templateId, this.basicFieldsForm.value.templateTitle as string, this.basicFieldsForm.value.templateDescription as string, customtemplateQuestionFormsArray);
        this.apiService.updateTemplate(templateData);
        this.bsModalRef.hide();
    }

    private initializeTemplateQuestionsForm(): void {
        this.templateQuestionsForm = this.formBuilder.group({
            surveyQuestionName: [''],
            surveyQuestionDescription: [''],
            radiobutton: [''],
            options: this.formBuilder.array([]),
        });
    }

    hideModal():void {
        this.bsModalRef.hide();
    }

    deleteQuestion(index: number):void {
        this.formResponses.splice(index, 1);
    }

    updateQuestionName(event: Event, index: number):void {
        const target = event.target as HTMLInputElement;
        this.formResponses[index].questionName = target.value;
    }

    private generateSurveyQuestionForm(): FormGroup {
        return this.formBuilder.group({
            surveyQuestionName: [''],
            surveyQuestionDescription: [''],
            radiobutton: [''],
            options: this.formBuilder.array([]),
        });
    }

    removeOption(index: number, responseIndex: number):void {
        const currentResponse = this.formResponses[responseIndex];
        const inputFields = currentResponse.templateQuestionForm.get('options') as FormArray;
        inputFields.removeAt(index);
        currentResponse.maxInputFieldsErrorMsg = '';
    }

    addDescription():void {
        this.showDescription = true;
    }

    saveBasicFields():void {
        this.updateActiveStep(this.currentStep.SurveyQuestions);
        let templateId = this.templateToUpdate.templateId;
        this.apiService.getTemplateQuestions(templateId).subscribe((templateQuestions: any) => {
            this.spinner.hide();
            templateQuestions.forEach((question: any) => {
                const newSurveyQuestionsForm = this.generateSurveyQuestionForm();
                newSurveyQuestionsForm.patchValue({
                    surveyQuestionName: question.questionText,
                    surveyQuestionDescription: question.description,
                    radiobutton: question.questionType,
                    options: question.options.map((option: Option) => ({
                        optionId: option.optionId,
                        optionValue: option.optionText,
                    })),
                });

                if (question.options && question.options.length) {
                    const inputFields = newSurveyQuestionsForm.get('options') as FormArray;
                    inputFields.clear();
                    question.options.forEach((option: Option) => {
                        inputFields.push(this.formBuilder.control(option.optionText));
                    });
                }
                this.formResponses.push({
                    templateQuestionForm: newSurveyQuestionsForm,
                    questionName: question.questionText,
                });
            });
        });
    }

    addOption(index: number): void {
        const currentResponse = this.formResponses[index];
        const inputFields = currentResponse.templateQuestionForm.get('options') as FormArray;
        const maxOptions = 5;    
        if (inputFields.length < maxOptions) {
            inputFields.push(this.formBuilder.control(''));
            currentResponse.maxInputFieldsErrorMsg = '';
            this.options.push({ optionId: this.optionIdCounter++, optionValue: '' });
        } else {
            currentResponse.maxInputFieldsErrorMsg = 'Max 5 options';
        }
    }    

    addQuestion():void {
        this.formResponses.push({
            templateQuestionForm: this.generateSurveyQuestionForm(),
            questionName: '',
        });
    }

    updateActiveStep(step: number):void {
        this.activeStep = step;
    }
}