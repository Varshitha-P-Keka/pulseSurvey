import { Option } from './option.model';

export class updateTemplateQuestion {
    templateQuestionId: string;
    templateId: string;
    questionText: string;
    description: string;
    questionType: string;
    options: Option[];

    constructor(id: string, templateId: string, text: string, description: string, type: string, options: Option[]) {
        this.templateQuestionId = id;
        this.templateId = templateId;
        this.questionText = text;
        this.description = description;
        this.questionType = type;
        this.options = options;
    }
}