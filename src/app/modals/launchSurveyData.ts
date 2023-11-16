import { SurveyQuestion } from "./launchSurveyQuestions";

export class SurveyData {
    constructor(
      public surveyId: number,
      public surveyTitle: string,
      public surveyDescription: string,
      public launchedOn: string,
      public expiresOn: string,
      public adminId: number,
      public surveyQuestions: SurveyQuestion[]
    ) {}
  }