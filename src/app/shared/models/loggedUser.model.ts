export class Loggeduser {
    employeeId: string;
    role: string;
    emailaddress: string;
    name: string;
    profilePicture: string;
    
    constructor(employeeId: string, role: string, emailaddress: string, name: string, profilePicture: string) {
        this.employeeId = employeeId;
        this.role = role;
        this.emailaddress = emailaddress;
        this.name = name;
        this.profilePicture = profilePicture;
    }
}