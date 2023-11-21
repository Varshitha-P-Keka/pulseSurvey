import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormArray } from '@angular/forms';

import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { ApiService } from 'src/app/services/api.service';
import { ModalService } from 'src/app/services/modal-service.service';
import { TemplateQuestion } from 'src/app/modals/updateTemplateQuestions';
import { TemplateData } from 'src/app/modals/updateTemplateData';
import { Option } from 'src/app/modals/optionsModal';

enum ActiveStep {
    BasicFields = 1,
    SurveyQuestions = 2,
}

@Component({
    selector: 'app-update-template',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AccordionModule],
    providers: [BsModalService, BsDatepickerConfig],
    templateUrl: './update-template.component.html',
})
export class UpdateTemplateComponent {
    showDescription: boolean = false;
    activeStep: ActiveStep = ActiveStep.BasicFields;
    questionName: any;
    maxInputFieldsErrorMsg: any;
    formResponses: any[] = [];
    options: any[] = [];
    basicFieldsForm!: FormGroup;
    templateQuestionsForm!: FormGroup;
    templateQuestions: any;
    templateToUpdate: any;
    optionIdCounter: any;

    constructor(private apiService: ApiService, private modalService: ModalService, private formBuilder: FormBuilder, public bsModalRef: BsModalRef) {}

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

    private initializeTemplateQuestionsForm(): void {
        this.templateQuestionsForm = this.formBuilder.group({
            surveyQuestionName: [''],
            surveyQuestionDescription: [''],
            radiobutton: [''],
            options: this.formBuilder.array([]),
        });
    }

    hideModal() {
        this.bsModalRef.hide();
    }

    deleteAccordion(index: number) {
        this.formResponses.splice(index, 1);
    }

    generateSurveyQuestionForm(): FormGroup {
        return this.formBuilder.group({
            surveyQuestionName: [''],
            surveyQuestionDescription: [''],
            radiobutton: [''],
            options: this.formBuilder.array([]),
        });
    }

    removeInputField(index: number, responseIndex: number) {
        const currentResponse = this.formResponses[responseIndex];
        const inputFields = currentResponse.templateQuestionForm.get('options') as FormArray;
        inputFields.removeAt(index);
        currentResponse.maxInputFieldsErrorMsg = '';
    }

    addDescription() {
        this.showDescription = true;
    }

    onSave() {
        this.updateActiveStep(2);
        let templateId = this.templateToUpdate.templateId;
        this.apiService.getTemplateQuestions(templateId).subscribe((templateQuestions: any) => {
            templateQuestions.forEach((question: any) => {
                const newForm = this.generateSurveyQuestionForm();
                newForm.patchValue({
                    surveyQuestionName: question.questionText,
                    surveyQuestionDescription: question.description,
                    radiobutton: question.questionType,
                    options: question.options.map((option: any) => ({
                        optionId: option.optionId,
                        optionValue: option.optionText,
                    })),
                });

                if (question.options && question.options.length) {
                    const inputFields = newForm.get('options') as FormArray;
                    inputFields.clear();
                    question.options.forEach((option: Option) => {
                        inputFields.push(this.formBuilder.control(option.optionText));
                    });
                }
                this.formResponses.push({
                    templateQuestionForm: newForm,
                    questionName: question.questionText,
                });
            });
        });
    }

    addInputField(index: number) {
        const currentResponse = this.formResponses[index];
        const inputFields = currentResponse.templateQuestionForm.get('options') as FormArray;
        if (inputFields.length < 5) {
            inputFields.push(this.formBuilder.control(''));
            currentResponse.maxInputFieldsErrorMsg = '';
            this.options.push({ optionId: this.optionIdCounter++, optionValue: '' });
        } else {
            currentResponse.maxInputFieldsErrorMsg = 'Max 5 options';
        }
    }

    addResponse() {
        this.formResponses.push({
            templateQuestionForm: this.generateSurveyQuestionForm(),
            questionName: '',
        });
    }

    addTemplateQuestions() {
        const templateQuestionFormsArray = this.formResponses.map((response) => response.templateQuestionForm.value);
        const templateId = this.modalService.getUpdateTemplate().templateId;
        const customtemplateQuestionFormsArray = templateQuestionFormsArray.map(
            (formValue) =>
                new TemplateQuestion(
                    0,
                    templateId,
                    formValue.surveyQuestionName,
                    formValue.surveyQuestionDescription,
                    formValue.radiobutton,
                    formValue.options.map((option: any, index: any) => new Option(index + 1, option))
                )
        );
        const templateData = new TemplateData(this.basicFieldsForm.value.templateId, this.basicFieldsForm.value.templateTitle as string, this.basicFieldsForm.value.templateDescription as string, customtemplateQuestionFormsArray);
        this.apiService.updateTemplate(templateData);
        this.bsModalRef.hide();
    }

    updateActiveStep(step: number) {
        this.activeStep = step;
    }
}
