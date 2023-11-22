import { SurveyQuestion } from './launchSurveyQuestions.model';

export class SurveyData {
    constructor(public surveyId: string, public surveyTitle: string, public surveyDescription: string, public launchedOn: string, public expiresOn: string, public adminId: number, public surveyQuestions: SurveyQuestion[]) {}
}
