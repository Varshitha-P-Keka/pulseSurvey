import { updateTemplateQuestion } from './updateTemplateQuestions.model';

export class TemplateData {
    templateId: number;
    templateTitle: string;
    templateDescription: string;
    templateQuestions: updateTemplateQuestion[];

    constructor(id: number, title: string, description: string, questions: updateTemplateQuestion[]) {
        this.templateId = id;
        this.templateTitle = title;
        this.templateDescription = description;
        this.templateQuestions = questions;
    }
}