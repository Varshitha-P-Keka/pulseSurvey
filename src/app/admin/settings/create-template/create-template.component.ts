import { Component, OnInit } from '@angular/core';
import { CommonModule,DatePipe } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup,ReactiveFormsModule,FormBuilder, FormArray } from '@angular/forms';

import { ServicesService } from 'src/app/services/services.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

import { ModalServiceService } from 'src/app/services/modal-service.service';
import { newTemplateData } from '../../../modals/newTemplateData';
import { TemplateQuestion } from 'src/app/modals/templateQuestionsArray';

enum ActiveStep {
  BasicFields = 1,
  SurveyQuestions = 2,
}

@Component ({
  selector: 'app-create-template',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,AccordionModule],
  providers: [BsModalService,BsDatepickerConfig],
  templateUrl: './create-template.component.html',
})

export class CreateTemplateComponent implements OnInit {
  showAdditionalItems = false;
  showDescription: boolean = false;
  activeStep: ActiveStep = ActiveStep.BasicFields;
  questionName: any;
  maxInputFieldsErrorMsg: any;
  templateId:any;
  formResponses: any[] = [];
  options: any[] = [];
  optionIdCounter = 1; 
  basicFieldsForm!: FormGroup;
  templateQuestionsForm!: FormGroup;
  templateQuestions:any;

  ngOnInit(): void {
    this.basicFieldsForm = this.formBuilder.group({
      templateTitle: [''],
      templateDescription: ['']
    });

    this.templateQuestionsForm = this.formBuilder.group({
      surveyQuestionName: [''],
      surveyQuestionDescription: [''],
      radiobutton: [''],
      inputFields: this.formBuilder.array([]),
    });
  }

  constructor(private router: Router,private service: ServicesService,private modalService: BsModalService,private ModalService: ModalServiceService,private formBuilder: FormBuilder,private datePipe: DatePipe,public bsModalRef:BsModalRef) {}
  
  updateActiveStep(step: number) {
    this.activeStep = step;
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

  addTemplateQuestions() {
    const formattedDate = new Date().toISOString();
    const customtemplateQuestionFormsArray = this.formResponses.map(response => 
      new TemplateQuestion(0,response.templateQuestionForm.value.surveyQuestionName,response.templateQuestionForm.value.surveyQuestionDescription,response.templateQuestionForm.value.radiobutton,response.templateQuestionForm.value.inputFields.map((option: any, index: any) => ({optionId: index + 1,optionText: option,})))
    );
    const TemplateData  = new newTemplateData(0,this.basicFieldsForm.value.templateTitle,this.basicFieldsForm.value.templateDescription,formattedDate,formattedDate,"Sahiti",customtemplateQuestionFormsArray)
    this.service.addNewTemplate(TemplateData);
    this.bsModalRef.hide();
  }  

  hideModal () {
    this.bsModalRef.hide();
  }
  
  onSave() {
    this.updateActiveStep(2);
  }
}