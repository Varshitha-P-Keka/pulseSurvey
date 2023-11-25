export class Employee {
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