export class SurveyQuestionResponseArray {
    questionResponseId: string;
    surveyQuestionId: number;
    response: string;
    constructor(questionResponseId: string, surveyQuestionId: number, response: string) {
        this.questionResponseId = questionResponseId;
        this.surveyQuestionId = surveyQuestionId;
        this.response = response;
    }
}
