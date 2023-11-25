export class updateSurveyData {
    surveyId: string;
    surveyTitle: string;
    surveyDescription: string;
    expiresOn: string;

    constructor(surveyId: string, surveyTitle: string, surveyDescription: string, expiresOn: string) {
        this.surveyId = surveyId;
        this.surveyTitle = surveyTitle;
        this.surveyDescription = surveyDescription;
        this.expiresOn = expiresOn;
    }
}