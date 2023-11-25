import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormGroup, ReactiveFormsModule, FormBuilder, FormArray, Validators } from '@angular/forms';

import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';
import { Guid } from 'guid-typescript';

import { NewTemplateData, TemplateQuestion, Option, ActiveStep, ApiService } from '../../../../shared';

@Component({
    selector: 'app-create-template',
    standalone: true,
    imports: [CommonModule, ReactiveFormsModule, AccordionModule],
    providers: [BsModalService, BsDatepickerConfig],
    templateUrl: './create-template.component.html',
})

export class CreateTemplateComponent implements OnInit {
    showAdditionalItems:boolean = false;
    showDescription: boolean = false;
    currentStep = ActiveStep;
    activeStep = this.currentStep.BasicFields;
    questionName: string = '';
    maxInputFieldsErrorMsg: string = '';
    templateId: string = '';
    formResponses: any[] = [];
    options: any[] = [];
    optionIdCounter = 1;
    basicFieldsForm!: FormGroup;
    templateQuestionsForm!: FormGroup;

    constructor(private apiService: ApiService, private formBuilder: FormBuilder, public bsModalRef: BsModalRef) {}

    ngOnInit(): void {
        this.initializeBasicFieldsForm();
        this.initializeTemplateQuestionsForm();
    }

    private initializeBasicFieldsForm():void {
        this.basicFieldsForm = this.formBuilder.group({
            templateTitle: ['', Validators.required],
            templateDescription: ['', Validators.required],
        });
    }

    private initializeTemplateQuestionsForm():void {
        this.templateQuestionsForm = this.formBuilder.group({
            surveyQuestionName: ['', [Validators.required]],
            surveyQuestionDescription: [''],
            radiobutton: ['', [Validators.required]],
            inputFields: this.formBuilder.array([]),
            isRequired: false
        });
    }    

    updateActiveStep(step: number):void {
        this.activeStep = step;
    } 

    private generateGuidId = () => {
        const guidInstance = Guid.create();
        const value = Reflect.get(guidInstance, 'value');
        return value;
    };

    launchNewTemplate():void {
        const templateIds = {
          templateQuestionId: this.generateGuidId(),
          templateId: this.generateGuidId(),
        };

        const customTemplateQuestionFormsArray = this.formResponses.map(response => {
            const options = response.templateQuestionForm.value.inputFields.map((option:Option, index:number) => ({optionId: index + 1,optionText: option}));
            return new TemplateQuestion(
              templateIds.templateQuestionId,
              response.templateQuestionForm.value.surveyQuestionName,
              response.templateQuestionForm.value.surveyQuestionDescription,
              response.templateQuestionForm.value.radiobutton,
              options,
              response.templateQuestionForm.value.isRequired,
            );
          });
      
        const formattedDate = new Date().toISOString();
        const TemplateData = new NewTemplateData(
          templateIds.templateId,
          this.basicFieldsForm.value.templateTitle,
          this.basicFieldsForm.value.templateDescription,
          formattedDate,
          formattedDate,
          customTemplateQuestionFormsArray,
        );

        this.apiService.addNewTemplate(TemplateData);
        this.hideModal();
    }        

    addDescription():void {
        this.showDescription = true;
    }

    updateQuestionName(event: Event, index: number):void {
        const target = event.target as HTMLInputElement;
        this.formResponses[index].questionName = target.value;
    }

    addQuestion():void {
        this.formResponses.push ({
            templateQuestionForm: this.generateSurveyQuestionForm(),
            questionName: '',
        });
    }

    removeOption(index: number, responseIndex: number):void {
        const currentResponse = this.formResponses[responseIndex];
        const inputFields = currentResponse.templateQuestionForm.get('inputFields') as FormArray;
        inputFields.removeAt(index);
        currentResponse.maxInputFieldsErrorMsg = '';
    }

    private generateSurveyQuestionForm(): FormGroup {
        return this.formBuilder.group({
            surveyQuestionName: ['', [Validators.required]],
            surveyQuestionDescription: [''],
            radiobutton: ['', [Validators.required]],
            inputFields: this.formBuilder.array([]),
            isRequired:false
        });
    }

    addOption(index: number): void {
        const currentResponse = this.formResponses[index];
        const inputFields = currentResponse.templateQuestionForm.get('inputFields') as FormArray;
        if (inputFields.length < 5) {
          inputFields.push(this.formBuilder.control(''));
          this.options.push({ optionId: this.optionIdCounter++, optionValue: '' });
        }      
        currentResponse.maxInputFieldsErrorMsg = inputFields.length < 5 ? '' : 'Maximum of 5 options allowed';
    }

    isLaunchDisabled(): boolean {
        let hasError = false;
        if (this.basicFieldsForm.invalid) {
          hasError = true;
        } else {
          hasError = this.formResponses.some(response => response.templateQuestionForm.invalid);
        }
        const noRadioButtonSelected = this.formResponses.some(response => !response.templateQuestionForm.value.radiobutton);
        const noQuestions = this.formResponses.length === 0;
      
        return hasError || noRadioButtonSelected || noQuestions;
    }
      

    deleteQuestion(index: number):void {
        this.formResponses.splice(index, 1);
    }

    hideModal():void {
        this.bsModalRef.hide();
    }

    saveBasicFields():void { 
        this.updateActiveStep(this.currentStep.SurveyQuestions);
    }
}