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
    EmployeeId: string;
    role: string;
    emailaddress: string;
    name: string;
    constructor(EmployeeId: string, role: string, emailaddress: string, name: string) {
        this.EmployeeId = EmployeeId;
        this.role = role;
        this.emailaddress = emailaddress;
        this.name = name;
    }
}
