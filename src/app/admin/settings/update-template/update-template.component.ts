import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import {FormGroup,ReactiveFormsModule,FormBuilder,FormArray,} from '@angular/forms';
import { ServicesService } from 'src/app/services/services.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { DatePipe } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import {BsDatepickerConfig,BsDatepickerModule} from 'ngx-bootstrap/datepicker';

@Component ({
  selector: 'app-update-template',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,AccordionModule],
  providers: [BsModalService,BsDatepickerConfig],
  templateUrl: './update-template.component.html'
})

export class UpdateTemplateComponent {

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
  basicFieldsForm!: FormGroup;
  templateQuestionsForm!: FormGroup;
  formdata: any;
  fullModalRef!: BsModalRef;
  templateQuestions:any;
  updateSurveyForm!: FormGroup;
  updateTemplateModalRef!: BsModalRef;
  templateToUpdate:any;
  optionIdCounter: any;

  ngOnInit(): void {
    this.templateToUpdate = this.ModalService.getUpdateTemplate();
    this.basicFieldsForm = this.fb.group({
      templateId: this.templateToUpdate.templateId,
      templateTitle: this.templateToUpdate.templateTitle,
      templateDescription: this.templateToUpdate.templateDescription
    });

    this.templateQuestionsForm = this.fb.group({
      surveyQuestionName: [''],
      surveyQuestionDescription: [''],
      radiobutton: [''],
      options: this.fb.array([]),
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
  
hideModal () {
  this.bsModalRef.hide();
}

generateSurveyQuestionForm(): FormGroup {
  return this.fb.group({
    surveyQuestionName: [''],
    surveyQuestionDescription: [''],
    radiobutton: [''],
    options: this.fb.array([]),
  });
}

addDescription() {
  this.showDescription = true;
}

onSave() {
  this.updateActiveStep(2);
  let templateId = this.templateToUpdate.templateId;
  console.log(templateId);
  console.log('basicfielsdsform',this.basicFieldsForm.value)
  const data = {
    templateId: this.basicFieldsForm.value.templateId,
    templateTitle: this.basicFieldsForm.value.templateTitle as string,
    templateDescription: this.basicFieldsForm.value.templateDescription as string
  }

  console.log('this data daataaaa', data);
  // this.service.updatetemplate(data);  
  this.service.getTemplateQuestions(templateId).subscribe((templateQuestions: any) => {
    console.log('template questions', templateQuestions);
    templateQuestions.forEach((question: any) => {
      const newForm = this.generateSurveyQuestionForm(); 
      newForm.patchValue ({
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
        question.options.forEach((option: any) => {
        inputFields.push(this.fb.control(option.optionText));
        });
      }
      this.responses.push ({
        templateQuestionForm: newForm,
        questionName: question.questionText,
      });
    }); 
  });
}

addInputField(index: number) {
  console.log(index);
  const currentResponse = this.responses[index];
  const inputFields = currentResponse.templateQuestionForm.get('options') as FormArray;
  if (inputFields.length < 5) {
      inputFields.push(this.fb.control(''));
      currentResponse.errorMessage = '';
      this.options.push({ optionId: this.optionIdCounter++, optionValue: '' });
  } else {
      currentResponse.errorMessage = 'Max 5 options';
  }
}

addResponse() {
  this.responses.push({
    templateQuestionForm: this.generateSurveyQuestionForm(),
    questionName: '', 
  });
}

addTemplateQuestions() {
  const templateQuestionFormsArray = this.responses.map(
    (response) => response.templateQuestionForm.value
  );
  let templateid = this.ModalService.getUpdateTemplate().templateId;
  console.log('tid',templateid)
  console.log('temp',templateQuestionFormsArray);
  const customtemplateQuestionFormsArray = templateQuestionFormsArray.map (
    (formValue) => ({
      templateQuestionId: 0,
      templateId: templateid,
      questionText: formValue.surveyQuestionName,
      description: formValue.surveyQuestionDescription,
      questionType: formValue.radiobutton,
      options: formValue.options.map((option:any, index:any) => ({
        optionId: index + 1,
        optionText: option,
    })),
    })
  );

  console.log('hey hey update template questions!!!!!!',customtemplateQuestionFormsArray);
  const templateData = {
    templateId: this.basicFieldsForm.value.templateId,
    templateTitle: this.basicFieldsForm.value.templateTitle as string,
    templateDescription: this.basicFieldsForm.value.templateDescription as string,
    templateQuestions: customtemplateQuestionFormsArray


  }
  console.log('template dataaaaaaaa',templateData);
  this.service.updateTemplate(templateData);
  this.bsModalRef.hide();
}

updateActiveStep(step: number) {
  this.activeStep = step;
}
}