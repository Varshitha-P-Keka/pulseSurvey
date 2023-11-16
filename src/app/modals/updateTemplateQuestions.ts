import { Option } from "./optionsModal";

export class TemplateQuestion {
    templateQuestionId: number;
    templateId: number;
    questionText: string;
    description: string;
    questionType: string;
    options: Option [];
  
    constructor(id: number, templateId: number, text: string, description: string, type: string, options: Option[]) {
      this.templateQuestionId = id;
      this.templateId = templateId;
      this.questionText = text;
      this.description = description;
      this.questionType = type;
      this.options = options;
    }
  }