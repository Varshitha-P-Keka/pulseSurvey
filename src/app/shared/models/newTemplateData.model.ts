export class NewTemplateData {
    templateId: string;
    templateTitle: string;
    templateDescription: string;
    createdOn: string;
    updatedOn: string;
    templateQuestions: object;

    constructor(templateId: string, templateTitle: string, templateDescription: string, createdOn: string, updatedOn: string, templateQuestions: object) {
        this.templateId = templateId;
        this.templateTitle = templateTitle;
        this.templateDescription = templateDescription;
        (this.createdOn = createdOn), (this.updatedOn = updatedOn), (this.templateQuestions = templateQuestions);
    }
}