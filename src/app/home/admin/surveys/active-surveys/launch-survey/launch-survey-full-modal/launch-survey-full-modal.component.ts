import { CommonModule, DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import {FormGroup,ReactiveFormsModule,FormBuilder,FormArray,FormsModule,Validators } from '@angular/forms';

import { Guid } from 'guid-typescript';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { SpinnerVisibilityService } from 'ng-http-loader';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import {BsDatepickerModule,BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { ApiService,Option, SurveyData,SurveyQuestion, ModalService,ActiveStep,SelectedItem } from '../../../../../../shared';

@Component({
  selector: 'app-launch-survey-full-modal',
  standalone: true,
  imports: [CommonModule,BsDatepickerModule,ReactiveFormsModule,AccordionModule,FormsModule],
  providers: [BsModalService, BsDatepickerConfig],
  templateUrl: './launch-survey-full-modal.component.html'
})

export class LaunchSurveyFullModalComponent implements OnInit {
  constructor(public bsModalRef: BsModalRef,private modalService: ModalService,private apiService: ApiService,private formBuilder: FormBuilder,private datePipe: DatePipe, private spinner: SpinnerVisibilityService) {}
  showDescription: boolean = false;
  selectedItem: string = '';
  SelectedItem: SelectedItem = SelectedItem.New;
  currentStep = ActiveStep;
  activeStep = this.currentStep.BasicFields;
  questionName: string = '';
  errorInpuFieldMsg: string = '';
  templateId: string = '';
  exisitngTemplates: any[] = [];
  formResponses: any[] = [];
  optionIdCounter:number = 1;
  isButtonDisabled:boolean = true;
  options: any[] = [];
  basicFieldsForm!: FormGroup;
  surveyQuestionsForm!: FormGroup;
  ModalRef!: BsModalRef | undefined;
  templateQuestions: any[] = [];
  errorQName:string = '';

  ngOnInit(): void {
    this.initializeBasicFieldsForm();
    this.initializeSurveyQuestionsForm();
    this.subscribeToEvents();
  }

  private initializeBasicFieldsForm():void {
    this.basicFieldsForm = this.formBuilder.group({
      surveyId: [''],
      surveyName: ['', [Validators.required]],
      surveyDescription: ['', [Validators.required]],
      surveyExpiry: ['', [Validators.required]],
    });
  }

  private initializeSurveyQuestionsForm():void {
    this.surveyQuestionsForm = this.formBuilder.group({
      surveyQuestionName: ['', [Validators.required]],
      surveyQuestionDescription: [''],
      radiobutton: ['', [Validators.required]],
      inputFields: this.formBuilder.array([]),
      isRequired: [false,[Validators.required]]
    
    });
  }

  isLaunchDisabled(): boolean {
    let hasError = false;
    if (this.basicFieldsForm.invalid) {
      hasError = true;
    } else {
      hasError = this.formResponses.some(response => response.surveyQuestionForm.invalid);
    }
    const noRadioButtonSelected = this.formResponses.some(response => !response.surveyQuestionForm.value.radiobutton);
    const noQuestions = this.formResponses.length === 0;
  
    return hasError || noRadioButtonSelected || noQuestions;
  }
  

  private subscribeToEvents():void {
    this.modalService.getSelectedItem().subscribe({
      next: (data) => {
        this.selectedItem = data;
      },
    });

    this.apiService.getTemplates().subscribe((data: any) => {
      this.spinner.hide();
      this.exisitngTemplates = data;
      const selectedTemplate = this.exisitngTemplates.find(
        (template: { templateTitle: string }) =>
          template.templateTitle === this.selectedItem
      );
      if (selectedTemplate) {
        this.basicFieldsForm.patchValue({
          surveyName: selectedTemplate.templateTitle,
          surveyDescription: this.getSurveyDescription(),
        });
      }
    });
  }

  checkValidity(control: any | null): void {
    if (control) {
      control.markAsTouched();
    }
  }  

  generateOptionFormControl(optionId: number, optionText: string):FormGroup {
    return this.formBuilder.group({
      optionId: [optionId],
      optionText: [optionText],
    });
  }

  private generateGuidId = () => {
    const guidInstance = Guid.create();
    const value = Reflect.get(guidInstance, 'value');
    return value;
  };

  launchSurvey():void {
    const surveyIds = {
      surveyQuestionId: this.generateGuidId(),
      surveyId: this.generateGuidId(),
    };

    const customSurveyQuestionFormsArray = this.formResponses.map(response => {
      const options = response.surveyQuestionForm.value.inputFields.map((option:Option, index:number) => ({optionId: index + 1,optionText: option}));
      return new SurveyQuestion(
        surveyIds.surveyQuestionId,
        response.surveyQuestionForm.value.surveyQuestionName,
        response.surveyQuestionForm.value.surveyQuestionDescription,
        response.surveyQuestionForm.value.radiobutton,
        options,
        response.surveyQuestionForm.value.isRequired,
      );
    });

    const surveyData = new SurveyData(
      surveyIds.surveyId,
      this.basicFieldsForm.value.surveyName,
      this.basicFieldsForm.value.surveyDescription,
      this.formatDate(new Date()),
      this.formatDate(this.basicFieldsForm.value.surveyExpiry),
      customSurveyQuestionFormsArray
    );
  
    this.apiService.sendSurveyQuestions(surveyData);
    this.hideModal();
  }

  addOption(index: number):void {
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

  deleteQuestion(index: number):void {
    this.formResponses.splice(index, 1);
  }

  removeOption(index: number, responseIndex: number):void {
    const currentResponse = this.formResponses[responseIndex];
    const inputFields = currentResponse.surveyQuestionForm.get('inputFields') as FormArray;
    inputFields.removeAt(index);
    currentResponse.errorInpuFieldMsg = '';
  }

  addDescription():void {
    this.showDescription = true;
  }

  updateActiveStep(step: number):void {
    this.activeStep = step;
  }

  updateQuestionName(event: Event, index: number):void {
    const target = event.target as HTMLInputElement;
    this.formResponses[index].questionName = target.value;
  }

  addQuestion():void {
    this.formResponses.push({
      surveyQuestionForm: this.generateSurveyQuestionForm(),
    });
  }

  hideModal():void {
    this.bsModalRef.hide();
    this.modalService.hideSmallModal();
  }

  generateSurveyQuestionForm(): FormGroup {
    return this.formBuilder.group({
      surveyQuestionName: ['', [Validators.required]],
      surveyQuestionDescription: [''],
      radiobutton: ['', [Validators.required]],
      inputFields: this.formBuilder.array([]),
      isRequired: [false,[Validators.required]]
    });
  }

  private getSurveyDescription():[] {
    const selectedTemplate = this.exisitngTemplates.find((template: { templateTitle: string }) =>
      template.templateTitle === this.selectedItem
    );
    return selectedTemplate ? selectedTemplate.templateDescription : '';
  }

  getTemplateIdByName(selectedItem: string): string | null {
    for (const template of this.exisitngTemplates) {
      if (template.templateTitle === selectedItem) {
        return template.templateId;
      }
    }
    return null;
  }  
  
  saveBasicFields(): void {
    this.updateActiveStep(this.currentStep.SurveyQuestions);  
    if (this.selectedItem === SelectedItem.New) return;
    const templateId = this.getTemplateIdByName(this.selectedItem);
    if (!templateId) return;   
    this.fetchTemplateQuestions(templateId);
  }
  
  private fetchTemplateQuestions(templateId: string): void {
    this.apiService.getTemplateQuestions(templateId).subscribe((templateQuestions: any) => {
      this.spinner.hide();
      this.populateTemplateQuestions(templateQuestions);
    });
  }
  
  private populateTemplateQuestions(templateQuestions: any[]): void {
    templateQuestions.forEach((question: any) => {
      const newSurveyQuestionForm = this.generateSurveyQuestionForm();
      newSurveyQuestionForm.patchValue({
        surveyQuestionName: question.questionText,
        surveyQuestionDescription: question.description,
        radiobutton: question.questionType,
      });
  
      if (question.options && question.options.length) {
        this.updateInputFields(newSurveyQuestionForm, question.options);
      }
  
      this.formResponses.push({
        surveyQuestionForm: newSurveyQuestionForm,
        questionName: question.questionText,
      });
    });
  }
  
  private updateInputFields(form: FormGroup, options: any[]): void {
    const inputFields = form.get('inputFields') as FormArray;
    inputFields.clear();
    options.forEach((option: any) => {
      inputFields.push(this.formBuilder.control(option.optionText));
    });
  }  

  private formatDate(date: Date):string {
    let fdate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS');
    return fdate + 'Z';
  }

  toBasicFields() {
    this.updateActiveStep(1);
  }
}