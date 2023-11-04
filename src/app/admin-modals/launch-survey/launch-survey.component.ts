import { Component, OnInit, ViewChild, TemplateRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';
import {FormGroup,ReactiveFormsModule,FormBuilder,FormArray,} from '@angular/forms';
import { ServicesService } from 'src/app/services/services.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap/modal';
import { ModalServiceService } from 'src/app/services/modal-service.service';
import { BsDropdownDirective, BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { DatePipe } from '@angular/common';
import { AccordionModule } from 'ngx-bootstrap/accordion';
import {BsDatepickerConfig,BsDatepickerModule} from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'app-launch-survey',
  standalone: true,
  imports: [CommonModule,BsDatepickerModule,ReactiveFormsModule,BsDropdownModule,AccordionModule,FormsModule,],
  providers: [BsModalService, BsDatepickerConfig],
  templateUrl: './launch-survey.component.html',
  styleUrls: ['./launch-survey.component.scss'],
})

export class LaunchSurveyComponent implements OnInit {
  showAdditionalItems = false;
  showDescription: boolean = false;
  selectedItem: string = 'Select';
  activeStep: number = 1;
  questionName: any;
  surveys: any;
  errorMessage: any;
  surveyNames: any;
  templateNames:any;
  bsConfig: Partial<BsDatepickerConfig> = {
    showWeekNumbers: false,
  };

  responses: any[] = [];
  options: any[] = [];
  basicFieldsForm!: FormGroup;
  surveyQuestionsForm!: FormGroup;
  formdata: any;
  launchSurveyModalRef!: BsModalRef;
  fullModalRef!: BsModalRef;
  
  @ViewChild('dropdown', { static: true }) dropdown!: BsDropdownDirective;
  @ViewChild('launchNewSurvey', { static: true })
  launchNewSurvey!: TemplateRef<any>;

  ngOnInit(): void {
    this.basicFieldsForm = this.fb.group({
      surveyId: [''],
      surveyName: [''],
      surveyDescription: [''],
      surveyExpiry: [''],
    });

    this.surveyQuestionsForm = this.fb.group({
      surveyQuestionName: [''],
      surveyQuestionDescription: [''],
      radiobutton: [''],
      inputFields: this.fb.array([]),
    });

    this.service.getactiveSurveys().subscribe((data) => {
      this.surveys = data;
      this.surveyNames = [];
      for (const survey of this.surveys) {
        this.surveyNames.push(survey.surveyTitle);
      }
    });

    this.ModalService.launchNewSurvey$.subscribe((data) => {
      this.launchSurvey();
    });  
  }

  constructor(private router: Router,private modalService: BsModalService,private ModalService: ModalServiceService,private service: ServicesService,private fb: FormBuilder,private datePipe: DatePipe) {}

  hideModal(modalRef: BsModalRef) {
    modalRef.hide();
  }
 
  launchSurveyQuestions() {
    const surveyQuestionFormsArray = this.responses.map(
      (response) => response.surveyQuestionForm.value
    );
    const customSurveyQuestionFormsArray = surveyQuestionFormsArray.map(
      (formValue) => ({
        surveyQuestionId: 0,
        surveyId: this.service.getSurveyId(),
        questionText: formValue.surveyQuestionName,
        description: formValue.surveyQuestionDescription,
        questionType: formValue.radiobutton,
        options: formValue.inputFields,
      })
    );
    this.service.sendSurveyQuestions(customSurveyQuestionFormsArray,this.service.getSurveyId());
    this.launchSurveyModalRef.hide();
    this.fullModalRef.hide()
    this.router.navigate(['/pulseSurvey/home/Admin/surveys/active']);    
  }

  addInputField(index: number) {
    const currentResponse = this.responses[index];
    const inputFields = currentResponse.surveyQuestionForm.get('inputFields') as FormArray;
    if (inputFields.length < 5) {
      inputFields.push(this.fb.control(''));
      currentResponse.errorMessage = ''; 
    } else {
      currentResponse.errorMessage = 'Max 5 options';
    }
  }

  deleteAccordion(index: number) {
    this.responses.splice(index, 1);
  }

  removeInputField(index: number, responseIndex: number) {
    const currentResponse = this.responses[responseIndex];
    const inputFields = currentResponse.surveyQuestionForm.get('inputFields') as FormArray;
    inputFields.removeAt(index);
    currentResponse.errorMessage = '';
  }

  addDescription() {
    this.showDescription = true;
  }

  updateActiveStep(step: number) {
    this.activeStep = step;
  }

  updateQuestionName(event: Event, index: number) {
    const target = event.target as HTMLInputElement;
    this.responses[index].questionName = target.value;
  }

  addResponse() {
    this.responses.push({
      surveyQuestionForm: this.generateSurveyQuestionForm(),
      questionName: '', 
    });
  }

  addQuestion() {
    this.responses.push({
      surveyQuestionForm: this.generateSurveyQuestionForm(),
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

  toggleAdditionalItems() {
    this.showAdditionalItems = !this.showAdditionalItems;
  }

  openFullModal(fullTemplate: TemplateRef<any>) {
    this.fullModalRef = this.modalService.show(fullTemplate, {
      class: 'full-modal',
    });
  }

  onItemSelect(item: string) {
    if (item === 'Create using existing template') {
      this.showAdditionalItems = true;
    } else {
      this.showAdditionalItems = false;
      this.selectedItem = item;
    }
  }

  onSave() {
    const newSurveyData = {
      surveyId: 0,
      surveyTitle: this.basicFieldsForm.value.surveyName,
      surveyDescription: this.basicFieldsForm.value.surveyDescription,
      launchedOn: this.formatDate(new Date()),
      expiresOn: this.formatDate(this.basicFieldsForm.value.surveyExpiry),
      adminId: 19,
    };
    this.service.launchNewSurvey(newSurveyData);
    this.updateActiveStep(2);
  }

  formatDate(date: any) {
    let fdate = this.datePipe.transform(date, 'yyyy-MM-ddTHH:mm:ss.SSS');
    return fdate + 'Z';
  }

  onAdditionalItemSelect(additionalItem: string) {
    this.selectedItem = additionalItem;
  }
  
  launchSurvey() {
    this.launchSurveyModalRef = this.modalService.show(this.launchNewSurvey, {class: 'small-modal',});
    this.selectedItem = 'select';
    this.service.getTemplates().subscribe((data)=> {
      console.log(data);
    })
  }
}