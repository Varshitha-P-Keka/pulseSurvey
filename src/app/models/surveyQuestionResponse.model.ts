import { SurveyQuestionAddResponse } from './surveyQuestionAddReponse.model';

export class surveyQuestionResponse {
    surveyId: number;
    responses: SurveyQuestionAddResponse[];
    constructor(surveyId: number, responses: SurveyQuestionAddResponse[]) {
        this.surveyId = surveyId;
        this.responses = responses;
    }
}
