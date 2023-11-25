import { Option } from ".";

export class SurveyQuestion {
    public surveyQuestionId: string;
    public questionText: string;
    public description: string;
    public questionType: string;
    public options: Option;
    public isRequired: boolean;

    constructor(
        surveyQuestionId: string,
        questionText: string,
        description: string,
        questionType: string,
        options: Option,
        isRequired: boolean
    ) {
        this.surveyQuestionId = surveyQuestionId;
        this.questionText = questionText;
        this.description = description;
        this.questionType = questionType;
        this.options = options;
        this.isRequired = isRequired;
    }
}