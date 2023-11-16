import { Component, ViewChild, TemplateRef, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormGroup,ReactiveFormsModule,FormBuilder, FormArray } from '@angular/forms';
import { ServicesService } from 'src/app/services/services.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { DatePipe } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import { BsDatepickerConfig } from 'ngx-bootstrap/datepicker';

@Component ({
  selector: 'app-create-template',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,AccordionModule],
  providers: [BsModalService,BsDatepickerConfig],
  templateUrl: './create-template.component.html'
})

export class CreateTemplateComponent implements OnInit {
  showAdditionalItems = false;
  bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
  };
  showDescription: boolean = false;
  selectedItem: string = 'Select';
  activeStep: number = 1;
  questionName: any;
  surveys: any;
  errorMessage: any;
  surveyNames: any;
  existingTemplateNames:any;
  templateId:any;
  exisitngTemplates:any
  responses: any[] = [];
  options: any[] = [];
  optionIdCounter = 1; 
  basicFieldsForm!: FormGroup;
  templateQuestionsForm!: FormGroup;
  formdata: any;
  launchSurveyModalRef!: BsModalRef;
  fullModalRef!: BsModalRef;
  templateQuestions:any;
  updateSurveyForm!: FormGroup;
  updateTemplateModalRef!: BsModalRef;
  templateToUpdate:any;

  ngOnInit(): void {
    this.basicFieldsForm = this.fb.group({
      templateTitle: [''],
      templateDescription: ['']
    });

    this.templateQuestionsForm = this.fb.group({
      surveyQuestionName: [''],
      surveyQuestionDescription: [''],
      radiobutton: [''],
      inputFields: this.fb.array([]),
    });
  }
  constructor(
    private router: Router,
    private service: ServicesService,
    private modalService: BsModalService,
    private ModalService: ModalServiceService,
    private fb: FormBuilder,
    private datePipe: DatePipe,
    public bsModalRef:BsModalRef
  ) {}



  updateActiveStep(step: number) {
    this.activeStep = step;
  }

  addDescription() {
    this.showDescription = true;
  }

  addResponse() {
    this.responses.push({
      templateQuestionForm: this.generateSurveyQuestionForm(),
      questionName: '', 
    });
  }

  generateSurveyQuestionForm(): FormGroup {
    return this.fb.group({
      surveyQuestionName: [''],
      surveyQuestionDescription: [''],
      radiobutton: [''],
      inputFields: this.fb.array([]),
    });
  }

  addInputField(index: number) {
    const currentResponse = this.responses[index];
    const inputFields = currentResponse.templateQuestionForm.get('inputFields') as FormArray;
    if (inputFields.length < 5) {
        inputFields.push(this.fb.control(''));
        currentResponse.errorMessage = '';
        this.options.push({ optionId: this.optionIdCounter++, optionValue: '' });
    } else {
        currentResponse.errorMessage = 'Max 5 options';
    }
  }

  addTemplateQuestions() {
    const currentDate = new Date();
    const formattedDate = currentDate.toISOString();
    const templateQuestionFormsArray = this.responses.map(
      (response) => response.templateQuestionForm.value
    );
    console.log('hi')
    console.log('temp',templateQuestionFormsArray);
    const customtemplateQuestionFormsArray = templateQuestionFormsArray.map(
      (formValue) => ({
        templateQuestionId: 0,
        questionText: formValue.surveyQuestionName,
        description: formValue.surveyQuestionDescription,
        questionType: formValue.radiobutton,
        options: formValue.inputFields.map((option:any, index:any) => ({
          optionId: index + 1,
          optionText: option,
      })),
      })
    );

    const newTemplateData = {
      templateId: 0,
      templateTitle: this.basicFieldsForm.value.templateTitle as string,
      templateDescription: this.basicFieldsForm.value.templateDescription as string,
      createdOn: formattedDate,
      updatedOn: formattedDate,
      launchedBy: "Sahiti",
      templateQuestions: customtemplateQuestionFormsArray      
    }
    this.service.addNewTemplate(newTemplateData);
    this.bsModalRef.hide();
  }

  hideModal () {
    this.bsModalRef.hide();
  }
  onSave() {
    this.updateActiveStep(2);
  }
}