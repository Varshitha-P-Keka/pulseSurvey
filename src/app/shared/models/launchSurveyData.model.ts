import { SurveyQuestion } from './launchSurveyQuestions.model';

export class SurveyData {
    surveyId: string;
    surveyTitle: string;
    surveyDescription: string;
    launchedOn: string;
    expiresOn: string;
    surveyQuestions: SurveyQuestion[]

    constructor(surveyId: string, surveyTitle: string, surveyDescription: string, launchedOn: string, expiresOn: string, surveyQuestions: SurveyQuestion[]) {
        this.surveyId = surveyId;
        this.surveyTitle = surveyTitle;
        this.surveyDescription = surveyDescription;
        this.launchedOn = launchedOn;
        this.expiresOn = expiresOn;
        this.surveyQuestions = surveyQuestions;
    }
}