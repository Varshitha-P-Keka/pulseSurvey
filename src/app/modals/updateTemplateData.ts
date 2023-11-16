import { TemplateQuestion } from "./updateTemplateQuestions";

export class TemplateData {
    templateId: number;
    templateTitle: string;
    templateDescription: string;
    templateQuestions: TemplateQuestion[];
  
    constructor(id: number, title: string, description: string, questions: TemplateQuestion[]) {
      this.templateId = id;
      this.templateTitle = title;
      this.templateDescription = description;
      this.templateQuestions = questions;
    }
  }