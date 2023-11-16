export class SurveyQuestion {
    constructor(
      public surveyQuestionId: number,
      public questionText: string,
      public description: string,
      public questionType: string,
      public options:  { optionId: number; optionText: string }[]
    ) {}
}