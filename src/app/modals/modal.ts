export class employee {
    employeeId?: number;
    employeeName: string;
    passwordHash: string;
    email: string;
    employeePhoto: string;
    isAdmin: boolean;

    constructor(employeeName: string, passwordHash: string, email: string, employeePhoto: string, isAdmin: boolean, employeeId?: number) {
        this.employeeName = employeeName;
        this.passwordHash = passwordHash;
        this.email = email;
        this.employeePhoto = employeePhoto;
        this.isAdmin = isAdmin;
        this.employeeId = employeeId;
    }
}

export class verifyEmployee {
    email: string;
    password: string;

    constructor(email: string, password: string) {
        this.email = email;
        this.password = password;
    }
}

export class loggeduser {
    employeeId: string;
    role: string;
    emailaddress: string;
    name: string;
    constructor(employeeId: string, role: string, emailaddress: string, name: string) {
        this.employeeId = employeeId;
        this.role = role;
        this.emailaddress = emailaddress;
        this.name = name;
    }
}

export class surveyQuestionAddResponse {
    questionResponseId: number;
    surveyQuestionId: number;
    comment: string;
    selectedOption: number;
    constructor(questionResponseId: number, surveyQuestionId: number, comment: string, selectedOption: number) {
        this.questionResponseId = questionResponseId;
        this.surveyQuestionId = surveyQuestionId;
        this.comment = comment;
        this.selectedOption = selectedOption;
    }
}