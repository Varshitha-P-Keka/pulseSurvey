export class TemplateQuestion {
    constructor(public templateQuestionId: string, public questionText: string, public description: string, public questionType: string, public options: { optionId: number; optionText: string }[],public isRequired:boolean) {}
}