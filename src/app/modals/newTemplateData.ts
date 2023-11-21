export class NewTemplateData {
    templateId: number;
    templateTitle: string;
    templateDescription: string;
    createdOn: string;
    updatedOn: string;
    launchedBy: string;
    templateQuestions: object;

    constructor(templateId: number, templateTitle: string, templateDescription: string, createdOn: string, updatedOn: string, launchedBy: string, templateQuestions: object) {
        this.templateId = templateId;
        this.templateTitle = templateTitle;
        this.templateDescription = templateDescription;
        (this.createdOn = createdOn), (this.updatedOn = updatedOn), (this.launchedBy = launchedBy), (this.templateQuestions = templateQuestions);
    }
}
