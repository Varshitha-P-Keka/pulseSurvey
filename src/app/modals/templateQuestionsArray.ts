export class TemplateQuestion {
    constructor(
      public templateQuestionId: number,
      public questionText: string,
      public description: string,
      public questionType: string,
      public options: { optionId: number; optionText: string }[]   ) {}  
}